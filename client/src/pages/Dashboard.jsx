import { useEffect, useState } from 'react';

import API from '../api/axios';

import socket from '../socket/socket';

import CreateIncidentModal from '../components/CreateIncidentModal';
import AlertGenerator from '../components/AlertGenerator';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchIncidents = async () => {
    try {
      const { data } = await API.get('/incidents');

      setIncidents(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchIncidents();

    socket.on('incident-created', (incident) => {
      setIncidents((prev) => [incident, ...prev]);
    });

    socket.on('incident-updated', (updatedIncident) => {
      setIncidents((prev) =>
        prev.map((incident) => (incident._id === updatedIncident._id ? updatedIncident : incident))
      );
    });

    socket.on('incident-escalated', (updatedIncident) => {
      setIncidents((prev) =>
        prev.map((incident) => (incident._id === updatedIncident._id ? updatedIncident : incident))
      );
    });

    return () => {
      socket.off('incident-created');
      socket.off('incident-updated');
      socket.off('incident-escalated');
    };
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/incidents/${id}`, {
        status,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');

      logout();

      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Incident Dashboard</h1>

        <div className="flex gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-red-500 px-5 py-3 rounded-xl font-bold"
          >
            Create Incident
          </button>

          <button onClick={handleLogout} className="bg-slate-700 px-5 py-3 rounded-xl font-bold">
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="text-lg">Total Incidents</h2>

          <p className="text-3xl font-bold mt-2">{incidents.length}</p>
        </div>

        <div className="bg-red-900 p-6 rounded-xl">
          <h2 className="text-lg">Critical</h2>

          <p className="text-3xl font-bold mt-2">
            {incidents.filter((i) => i.severity === 'CRITICAL').length}
          </p>
        </div>

        <div className="bg-yellow-700 p-6 rounded-xl">
          <h2 className="text-lg">Escalated</h2>

          <p className="text-3xl font-bold mt-2">
            {incidents.filter((i) => i.status === 'ESCALATED').length}
          </p>
        </div>

        <div className="bg-green-700 p-6 rounded-xl">
          <h2 className="text-lg">Resolved</h2>

          <p className="text-3xl font-bold mt-2">
            {incidents.filter((i) => i.status === 'RESOLVED').length}
          </p>
        </div>
      </div>

      {user.role === 'ADMIN' && <AlertGenerator />}

      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Severity</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Assigned To</th>
              <th className="p-4 text-left">Team</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {incidents.map((incident) => (
              <tr key={incident._id} className="border-b border-slate-700">
                <td className="p-4">{incident.title}</td>

                <td className="p-4">{incident.severity}</td>

                <td className="p-4">{incident.status}</td>

                <td className="p-4">{incident.type}</td>
                <td className="p-4">{incident.assignedTo?.name || 'Unassigned'}</td>

                <td className="p-4">{incident.assignedTo?.team || '-'}</td>
                <td className="p-4">
                  {(user.role === 'ADMIN' || incident.assignedTo?._id === user._id) && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(incident._id, 'ACKNOWLEDGED')}
                        className="bg-yellow-600 px-3 py-1 rounded"
                      >
                        Ack
                      </button>

                      {user.role === 'ADMIN' && (
                        <button
                          onClick={() => updateStatus(incident._id, 'ESCALATED')}
                          className="bg-orange-600 px-3 py-1 rounded"
                        >
                          Escalate
                        </button>
                      )}

                      <button
                        onClick={() => updateStatus(incident._id, 'RESOLVED')}
                        className="bg-green-600 px-3 py-1 rounded"
                      >
                        Resolve
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CreateIncidentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
