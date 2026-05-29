import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import API from '../api/axios';

import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post('/auth/login', formData);

      login(data);

      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-slate-800 p-8 rounded-xl w-[400px]">
        <h1 className="text-3xl font-bold mb-6">Incident System Login</h1>

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

        <button className="w-full bg-red-500 p-3 rounded font-bold">Login</button>
      </form>
    </div>
  );
};

export default Login;
