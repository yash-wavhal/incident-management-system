import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import API from '../api/axios';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'RESPONDER',
    team: 'APPLICATION',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post('/auth/register', formData);

      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-xl w-[400px]">
        <h1 className="text-3xl font-bold mb-6">Register</h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 rounded bg-slate-700 mb-4"
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value,
            })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-slate-700 mb-4"
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-slate-700 mb-4"
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value,
            })
          }
        />

        <select
          className="w-full p-3 rounded bg-slate-700 mb-4"
          onChange={(e) =>
            setFormData({
              ...formData,
              role: e.target.value,
            })
          }
        >
          <option value="RESPONDER">RESPONDER</option>

          <option value="ADMIN">ADMIN</option>
        </select>

        <select
          className="w-full p-3 rounded bg-slate-700 mb-4"
          onChange={(e) =>
            setFormData({
              ...formData,
              team: e.target.value,
            })
          }
        >
          <option value="APPLICATION">APPLICATION</option>

          <option value="INFRA">INFRA</option>
        </select>

        <button className="w-full bg-red-500 p-3 rounded font-bold">Register</button>
      </form>
    </div>
  );
};

export default Register;
