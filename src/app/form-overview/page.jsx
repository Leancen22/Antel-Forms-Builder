// src/app/form-overview/page.jsx
'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

import { protectRoute } from '@/lib/protectedRoute';

const SkeletonCard = () => (
  <div className="p-4 bg-gray-200 rounded shadow animate-pulse">
    <div className="h-6 bg-gray-300 rounded mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
    <div className="h-8 bg-gray-300 rounded w-1/2"></div>
  </div>
);

const FormOverview = () => {

    protectRoute('/login');

  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await fetch('/api/getForms');
      const data = await response.json();
      setForms(data);
    } catch (error) {
      console.error("Error fetching forms:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async (id) => {
    const response = await fetch('/api/deleteForm', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setForms(forms.filter(form => form.id !== id));
    } else {
      alert('Error deleting form');
    }
  };

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
        <h1 className="text-2xl font-bold">Crea un Nuevo Formulario</h1>
        <div className="flex space-x-4">
          <Button onClick={createNewForm} className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full text-2xl">
            +
          </Button>
          <Button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading
          ? Array.from({ length: 3 }, (_, i) => <SkeletonCard key={i} />)
          : forms.map(form => (
            <div key={form.id} className="p-4 bg-gray-100 rounded shadow">
              <h2 className="text-lg font-semibold">{form.title}</h2>
              <div className="flex space-x-2 mt-2">
                <Button onClick={() => router.push(`/formulario/${form.id}`)} className="bg-blue-500 text-white">View</Button>
                <Button onClick={() => deleteForm(form.id)} className="bg-red-500 text-white">Delete</Button>
                <Button onClick={() => router.push(`/respuestas/${form.id}`)} className="bg-green-500 text-white">Respuestas</Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FormOverview;
