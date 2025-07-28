import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthForm = () => {
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');
  const [form, setForm] = useState({
    name: '',
    email: '',
    dob: '',
    otp: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate("/welcome")
    }

    // Check for error in URL parameters (from Google OAuth redirect)
    const errorParam = searchParams.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'auth_failed':
          setError('Google authentication failed. Please try again.');
          break;
        case 'invalid_callback':
          setError('Invalid authentication callback. Please try again.');
          break;
        default:
          setError('Authentication error occurred. Please try again.');
      }
    }
  }, [navigate, searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleGetOtp = async () => {
    setError('');
    try {
      if (!form.email) {
        setError('Email is required.');
        return;
      }

      if (mode === 'signup') {
        if (!form.name || !form.dob) {
          setError('Please fill all fields to sign up.');
          return;
        }

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await axios.post(`${apiUrl}/api/auth/send-otp`, {
          name: form.name,
          email: form.email,
          dob: form.dob,
        });
      } else {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await axios.post(`${apiUrl}/api/auth/verify-otp`, {
          email: form.email,
        });
      }

      setOtpSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      setOtpSent(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const res = await axios.post(`${apiUrl}/api/auth/verify-otp`, {
        email: form.email,
        otp: form.otp,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.name);
      localStorage.setItem('email', res.data.email);

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      navigate('/welcome');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  const handleResendOtp = async () => {
  setError('');
  try {
    if (!form.email) {
      setError('Email is required to resend OTP.');
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    await axios.post(`${apiUrl}/api/auth/resend-otp`, {
      email: form.email,
    });

    setError('A new OTP has been sent to your email.');
  } catch (err: any) {
    setError(err.response?.data?.message || 'Failed to resend OTP');
  }
};

const handleGoogleAuth = () => {
  // Redirect to Google OAuth endpoint
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  window.location.href = `${apiUrl}/api/auth/google`;
};

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-white relative">
        <div className="absolute top-4 left-4 md:left-8 md:top-6 text-2xl font-bold">
          <span className="flex items-center gap-2">
            <img src="/icon.svg" alt="icon" className="w-6 h-6" /> HD
          </span>
        </div>

        <div className="w-full max-w-md mt-16 md:mt-0">
          <h1 className="text-3xl font-bold mb-2 text-center md:text-left">
            {mode === 'signup' ? 'Sign up' : 'Sign in'}
          </h1>
          <p className="text-gray-600 mb-6 text-center md:text-left">
            {mode === 'signup'
              ? 'Sign up to enjoy features in HD'
              : 'Please login to continue to your account'}
          </p>

          <div className="flex flex-col gap-4 relative">
            {mode === 'signup' && (
              <>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    placeholder=" "
                    className="peer w-full border border-gray-300 rounded-md p-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                  <label htmlFor="name" className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600 transition-all">
                    Name
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="date"
                    id="dob"
                    placeholder=" "
                    className="peer w-full border border-gray-300 rounded-md p-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                  />
                  <label htmlFor="dob" className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600 transition-all">
                    Date of Birth
                  </label>
                </div>
              </>
            )}

            {/* Email input */}
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder=" "
                className="peer w-full border border-gray-300 rounded-md p-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              <label htmlFor="email" className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600 transition-all">
                Email
              </label>
            </div>

            {/* OTP input - shown in signin or after sending */}
            {(mode === 'signin' || otpSent) && (
              <div className="relative">
                <input
                  type="text"
                  id="otp"
                  placeholder=" "
                  className="peer w-full border border-gray-300 rounded-md p-3 pt-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleInputChange('otp', e.target.value)}
                />
                <label htmlFor="otp" className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600 transition-all">
                  OTP
                </label>
              </div>
            )}

            {/* Remember Me and Resend OTP */}
            {(mode === 'signin' || otpSent) && (
              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="form-checkbox border-gray-300"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Resend OTP
                </button>
              </div>
            )}

            {/* Action Button */}
            {!otpSent && mode === 'signup' && (
              <button
                onClick={handleGetOtp}
                className="bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
              >
                Get OTP
              </button>
            )}

            {(mode === 'signin' || otpSent) && (
              <button
                onClick={handleVerifyOtp}
                className="bg-blue-600 text-white py-3 mt-4 rounded-md hover:bg-blue-700 transition"
              >
                {mode === 'signup' ? 'Sign Up' : 'Sign In'}
              </button>
            )}

            {/* Switch Mode */}
            <p className="text-gray-600 text-sm text-center">
              {mode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <span onClick={() => { setMode('signin'); setOtpSent(false); setError(''); }} className="text-blue-600 underline cursor-pointer">
                    Sign in
                  </span>
                </>
              ) : (
                <>
                  Need an account?{' '}
                  <span onClick={() => { setMode('signup'); setOtpSent(false); setError(''); }} className="text-blue-600 underline cursor-pointer">
                    Sign up
                  </span>
                </>
              )}
            </p>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        </div>
      </div>

      {/* Right Section with Image */}
      <div className="hidden md:block w-full md:w-1/2 h-64 md:h-auto">
        <img src="/bg.jpg" alt="Signup Illustration" className="w-full h-full object-cover rounded-3xl p-3" />
      </div>
    </div>
  );
};

export default AuthForm;
