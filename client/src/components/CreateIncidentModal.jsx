import { useState } from 'react';

import API from '../api/axios';

const CreateIncidentModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post('/incidents', formData);

      setFormData({
        title: '',
        description: '',
      });

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-800 w-[500px] rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6">Create Incident</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Incident Title"
            className="w-full p-3 rounded bg-slate-700 mb-4"
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
          />

          <textarea
            placeholder="Incident Description"
            className="w-full p-3 rounded bg-slate-700 mb-4 h-32"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />

          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="bg-slate-600 px-4 py-2 rounded">
              Cancel
            </button>

            <button className="bg-red-500 px-4 py-2 rounded font-bold">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIncidentModal;
