import API from '../api/axios';

const AlertGenerator = () => {
  const generateAlert = async (title, description) => {
    try {
      await API.post('/incidents', {
        title,
        description,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl mb-8">
      <h2 className="text-2xl font-bold mb-6">Simulated Alert Generator</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Critical Infra */}
        <button
          onClick={() =>
            generateAlert('Production Server Crash', 'Critical server outage detected')
          }
          className="bg-red-700 hover:bg-red-800 p-4 rounded-xl font-semibold"
        >
          Server Crash
        </button>

        <button
          onClick={() => generateAlert('Database Failure', 'MongoDB cluster unreachable')}
          className="bg-red-600 hover:bg-red-700 p-4 rounded-xl font-semibold"
        >
          Database Failure
        </button>

        <button
          onClick={() => generateAlert('Network Outage', 'Critical network downtime')}
          className="bg-orange-600 hover:bg-orange-700 p-4 rounded-xl font-semibold"
        >
          Network Outage
        </button>

        {/* High */}
        <button
          onClick={() => generateAlert('High CPU Usage', 'CPU exceeded threshold')}
          className="bg-yellow-600 hover:bg-yellow-700 p-4 rounded-xl font-semibold"
        >
          High CPU
        </button>

        <button
          onClick={() => generateAlert('Memory Leak Detected', 'Memory usage increasing rapidly')}
          className="bg-yellow-700 hover:bg-yellow-800 p-4 rounded-xl font-semibold"
        >
          Memory Leak
        </button>

        {/* Medium */}
        <button
          onClick={() => generateAlert('Login API Slow', 'Users experiencing delay')}
          className="bg-blue-600 hover:bg-blue-700 p-4 rounded-xl font-semibold"
        >
          API Slowdown
        </button>

        {/* Low */}
        <button
          onClick={() => generateAlert('UI Alignment Bug', 'Minor dashboard alignment issue')}
          className="bg-green-700 hover:bg-green-800 p-4 rounded-xl font-semibold"
        >
          UI Bug
        </button>
      </div>
    </div>
  );
};

export default AlertGenerator;
