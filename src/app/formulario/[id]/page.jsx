// src/pages/formulario/[id].jsx
'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const Formulario = () => {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (id) {
      fetchForm();
    }
  }, [id]);

  const fetchForm = async () => {
    const response = await fetch(`/api/getFormById?id=${id}`);
    const data = await response.json();
    data.components = data.components.map(component => ({
      ...component,
      options: component.options || []
    }));
    setForm(data);
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async () => {
    const response = await fetch('/api/saveResponse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formId: id, answers }),
    });

    if (response.ok) {
      alert('Respuestas guardadas correctamente');
      router.push('/gracias'); 
    } else {
      alert('Error al guardar las respuestas');
    }
  };

  if (!form) {
    return <p>Cargando formulario...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
      <p className="mb-6">{form.description}</p>
      {form.components.map((component, index) => (
        <div key={index} className="mb-4">
          <label className="block text-lg mb-2">{component.question}</label>
          {component.type === 'text' && (
            <input
              type="text"
              onChange={(e) => handleAnswerChange(component.id, e.target.value)}
              className="border p-2 w-full"
            />
          )}
          {component.type === 'textarea' && (
            <textarea
              onChange={(e) => handleAnswerChange(component.id, e.target.value)}
              className="border p-2 w-full"
              rows="3"
            />
          )}
          {component.type === 'select' && (
            <select
              onChange={(e) => handleAnswerChange(component.id, e.target.value)}
              className="border p-2 w-full"
            >
              <option value="">Selecciona una opción</option>
              {component.options.map((option, optionIndex) => (
                <option key={optionIndex} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
      <Button onClick={handleSubmit} className="bg-blue-500 text-white">Enviar Respuestas</Button>
    </div>
  );
};

export default Formulario;
