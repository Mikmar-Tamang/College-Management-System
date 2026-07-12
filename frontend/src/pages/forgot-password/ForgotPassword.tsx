import { useState } from 'react';
import { FaEnvelope, FaUniversity, FaArrowLeft } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import type { ForgotPasswordForm } from '../../types/auth';
import axios, { AxiosError } from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit } = useForm<ForgotPasswordForm>();
  const navigate = useNavigate();

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setLoading(true);
      setError('');
      await axios.post(import.meta.env.VITE_API_URL + '/api/auth/forgot-password', data, {
        withCredentials: true,
      });
      // Navigate to verify code page, pass email via state
      navigate('/verify-reset-code', { state: { email: data.email } });
    } catch (err: unknown) {
      if(err instanceof AxiosError)
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-linear-to-r from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg shadow-blue-500/20">
              <FaUniversity className="text-2xl text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">College Management</h1>
          <p className="text-gray-400 text-sm mt-2">Reset your password</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-lg backdrop-filter border border-white/10 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-semibold text-white text-center mb-2">Forgot Password?</h2>
          <p className="text-gray-400 text-sm text-center mb-6">
            Enter your verified email and we'll send a reset code to it.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Verified Email */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Verified Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaEnvelope className="text-gray-400" />
                </span>
                <input
                  {...register('email', { required: true })}
                  type="email"
                  placeholder="your-email@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#1e293b] border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-linear-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending Code...
                </span>
              ) : (
                'Send Reset Code'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors inline-flex items-center gap-2"
            >
              <FaArrowLeft className="text-xs" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
