// src/pages/respuestas/[id].jsx
'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import { protectRoute } from '@/lib/protectedRoute';

ChartJS.register(ArcElement, Tooltip, Legend);

const Respuestas = () => {

    protectRoute('/login');

  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    if (id) {
      fetchFormAndResponses();
    }
  }, [id]);

  const fetchFormAndResponses = async () => {
    const formResponse = await fetch(`/api/getFormById?id=${id}`);
    const formData = await formResponse.json();
    setForm(formData);

    const responseResponse = await fetch(`/api/getResponsesByFormId?id=${id}`);
    const responseData = await responseResponse.json();
    setResponses(responseData);
  };

  const getPieChartData = (questionId) => {
    const optionCounts = {};

    responses.forEach(response => {
      const answer = response.answers[questionId];
      if (answer) {
        optionCounts[answer] = (optionCounts[answer] || 0) + 1;
      }
    });

    return {
      labels: Object.keys(optionCounts),
      datasets: [
        {
          data: Object.values(optionCounts),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        }
      ]
    };
  };

  if (!form) {
    return <p>Cargando respuestas...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Respuestas de: {form.title}</h1>
      {form.components.map((component, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-lg font-semibold">{component.question}</h2>
          {component.type === 'select' ? (
            <div className="mt-4">
              <Pie data={getPieChartData(component.id)} />
            </div>
          ) : (
            <ul className="list-disc ml-5 mt-2">
              {responses
                .map(response => response.answers[component.id])
                .filter(Boolean)
                .map((answer, idx) => (
                  <li key={idx} className="mb-1">{answer}</li>
                ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Respuestas;
