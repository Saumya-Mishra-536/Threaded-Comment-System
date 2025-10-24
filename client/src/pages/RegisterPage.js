import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = ({ onAuth, authError }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onAuth('register', form.username, form.password);
      navigate('/');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      {authError && <div className="bg-red-50 border border-red-200 rounded-md p-2 text-sm text-red-700 mb-3">{authError}</div>}
      <form onSubmit={submit} className="space-y-3 bg-white p-4 rounded-md border border-gray-200">
        <input className="w-full px-3 py-2 border rounded" placeholder="Username" value={form.username} onChange={(e)=>setForm(f=>({...f, username:e.target.value}))} />
        <input className="w-full px-3 py-2 border rounded" type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm(f=>({...f, password:e.target.value}))} />
        <button disabled={submitting} className="w-full bg-primary-blue text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50">Create account</button>
      </form>
    </div>
  );
};

export default RegisterPage;


