import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Actor screen removed — redirect to home.
export default function Actor() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/'); }, [navigate]);
  return null;
}
