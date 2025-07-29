import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard'); // or wherever you want after login
    } else {
      navigate('/login'); // fallback in case of failure
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen text-lg">
      Redirecting after Google Sign-In...
    </div>
  );
};

export default GoogleAuthSuccess;
