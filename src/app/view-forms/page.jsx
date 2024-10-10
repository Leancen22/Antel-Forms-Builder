// src/app/view-forms/page.jsx
'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const ViewForms = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    setForms([
      { id: 1, title: 'Form 1' },
      { id: 2, title: 'Form 2' },
      { id: 3, title: 'Form 3' },
    ]);
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Existing Forms</h1>
      <ul className="space-y-2">
        {forms.map(form => (
          <li key={form.id} className="border-b pb-2">
            <span>{form.title}</span>
            <Button className="ml-2" onClick={() => alert(`Editing ${form.title}`)}>Edit</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewForms;
