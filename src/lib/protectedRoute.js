// src/lib/protectRoute.js
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const protectRoute = (redirectTo) => {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('authenticated');
    if (!isAuthenticated) {
      router.push(redirectTo);
    }
  }, []);
};
