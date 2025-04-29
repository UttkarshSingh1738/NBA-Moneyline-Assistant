import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      // Show a quick alert or you could render a banner/message instead
      alert('Invalid token. Redirecting to login…');
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // While the effect is running, you can return null or a spinner.
  // Once redirected, this component will unmount.
  return sessionStorage.getItem('token') ? children : null;
}