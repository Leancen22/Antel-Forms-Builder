// src/app/form-overview/page.jsx
'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const FormOverview = () => {
  const [forms, setForms] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Simulación de datos
    setForms([
      { id: 1, title: 'Customer Feedback' },
      { id: 2, title: 'Employee Satisfaction' },
      { id: 3, title: 'Event Registration' },
    ]);
  }, []);

  const createNewForm = () => {
    router.push('/form-editor');
  };

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    router.push('/login');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Forms</h1>
        <div className="flex space-x-4">
          <Button onClick={createNewForm} className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full text-2xl">
            +
          </Button>
          <Button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {forms.map(form => (
          <div key={form.id} className="p-4 bg-gray-100 rounded shadow">
            <h2 className="text-lg font-semibold">{form.title}</h2>
            <Button onClick={() => alert(`Viewing ${form.title}`)} className="mt-2">View</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormOverview;
