// src/app/create-form/page.jsx
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const CreateFormPage = () => {
  const [questions, setQuestions] = useState([]);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('authenticated');
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [router]);

  const addQuestion = () => {
    setQuestions([...questions, { id: questions.length, text: '' }]);
  };

  const handleQuestionChange = (id, text) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Create a New Form</h1>
      <form className="space-y-4">
        <Input 
          value={formTitle} 
          onChange={e => setFormTitle(e.target.value)} 
          placeholder="Form Title" 
        />
        <Textarea 
          value={formDescription} 
          onChange={e => setFormDescription(e.target.value)} 
          placeholder="Form Description" 
          rows={4} 
        />
        <div className="space-y-2">
          {questions.map((question, index) => (
            <Input 
              key={index} 
              value={question.text} 
              onChange={e => handleQuestionChange(question.id, e.target.value)} 
              placeholder={`Question ${index + 1}`} 
            />
          ))}
        </div>
        <Button onClick={addQuestion}>Add Question</Button>
      </form>
    </div>
  );
};

export default CreateFormPage;
