import { useState, useEffect } from 'react';
import { FaLock, FaEye, FaEyeSlash, FaUniversity, FaCheckCircle } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import type { ResetPasswordForm } from '../../types/auth';
import axios, { AxiosError } from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, watch } = useForm<ResetPasswordForm>();
  const navigate = useNavigate();
  const location = useLocation();

  const resetToken = location.state?.resetToken;
  const password = watch('password');

  // Redirect if no token in state
  useEffect(() => {
    if (!resetToken) {
      navigate('/forgot-password');
    }
  }, [resetToken, navigate]);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (data.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await axios.post(
        import.meta.env.VITE_API_URL + '/api/auth/reset-password',
        { resetToken, newPassword: data.password },
        { withCredentials: true }
      );

      // Navigate to login with success message
      navigate('/', { state: { passwordReset: true } });
    } catch (err: unknown) {
      if(err instanceof AxiosError){
      setError(err.response?.data?.error || 'Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicators
  const getStrength = (pw: string | undefined) => {
    if (!pw) return { level: 0, text: '', color: '' };
    if (pw.length < 6) return { level: 1, text: 'Too short', color: 'bg-red-500' };
    if (pw.length < 8) return { level: 2, text: 'Weak', color: 'bg-orange-500' };
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pw)) return { level: 4, text: 'Strong', color: 'bg-green-500' };
    return { level: 3, text: 'Fair', color: 'bg-yellow-500' };
  };

  const strength = getStrength(password);

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
          <p className="text-gray-400 text-sm mt-2">Set your new password</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-lg backdrop-filter border border-white/10 rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-500/10 p-3 rounded-full">
              <FaCheckCircle className="text-2xl text-green-400" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-white text-center mb-2">Reset Password</h2>
          <p className="text-gray-400 text-sm text-center mb-6">
            Create a new password for your account.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaLock className="text-gray-400" />
                </span>
                <input
                  {...register('password', { required: true })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-12 py-3 bg-[#1e293b] border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {/* Strength Bar */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.level ? strength.color : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 ${
                    strength.level <= 1 ? 'text-red-400' : 
                    strength.level === 2 ? 'text-orange-400' : 
                    strength.level === 3 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {strength.text}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaLock className="text-gray-400" />
                </span>
                <input
                  {...register('confirmPassword', { required: true })}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-12 py-3 bg-[#1e293b] border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
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
                  Resetting Password...
                </span>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-500">
            Your password will be updated and you'll be redirected to login.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
