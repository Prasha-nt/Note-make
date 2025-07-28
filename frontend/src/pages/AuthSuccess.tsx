import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const error = searchParams.get('error');

    if (error) {
      // Handle error - redirect to login with error message
      navigate('/?error=' + error);
      return;
    }

    if (token && name && email) {
      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify({ name, email }));
      
      // Redirect to welcome page
      navigate('/welcome');
    } else {
      // Invalid callback - redirect to login
      navigate('/?error=invalid_callback');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;