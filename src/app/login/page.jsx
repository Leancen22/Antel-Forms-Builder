// src/app/login/page.jsx
'use client'

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password123') {
      localStorage.setItem('authenticated', 'true');
      router.push('/form-overview');
      alert('Invalid username or password');
    }
  };
  
  return (
    <div className="max-w-sm mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form className="space-y-4" onSubmit={handleLogin}>
        <Input 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          placeholder="Username" 
        />
        <Input 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Password" 
        />
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
};

export default LoginPage;
