import { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUniversity } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import type { LoginForm } from "../../types/auth"
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  collegeEmail: yup.string().email("Invalid email").required("College email required"),
  password: yup.string().required("Password is required").min(8, "Min 6 characters").max(12, "max 12 characters")
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({ resolver: yupResolver(schema) });
  const [loginError, setLoginError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const passwordReset = location.state?.passwordReset;
  const emailVerified = location.state?.emailVerified;

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      setLoginError("");
      const res = await axios.post(import.meta.env.VITE_API_URL + "/api/auth/login", data, { withCredentials: true });
      const role = res.data?.admin?.role;
      if (role === 'super_admin') {
        navigate('/super-admin');
      } else {
        navigate('/home');
      }
      console.log("you logged in")
    } catch (err: any) {
      console.log(err)
      if (err.response?.data?.code === 'PENDING_APPROVAL') {
        setLoginError("Wait! Your account is still in check by the super admin. Please wait for approval.");
        return;
      }
      setLoginError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
          <p className="text-gray-400 text-sm mt-2">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-lg backdrop-filter border border-white/10 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-semibold text-white text-center mb-6">Welcome Back</h2>

          {/* Email Verified Success Message */}
          {emailVerified && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm text-center">
                Email verified successfully! Your account is now pending approval by the super admin.
              </p>
            </div>
          )}

          {/* Password Reset Success Message */}
          {passwordReset && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm text-center">Password reset successful! Please sign in with your new password.</p>
            </div>
          )}

          {/* Login Error Message */}
          {loginError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm text-center">{loginError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaEnvelope className="text-gray-400" />
                </span>
                <input
                  {...register("collegeEmail")}
                  type="email"
                  placeholder="admin@college.edu.np"
                  className="w-full pl-10 pr-4 py-3 bg-[#1e293b] border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
              <p className='text-red-500 text-sm font-medium mt-1 min-h-5'>{errors.collegeEmail?.message}</p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaLock className="text-gray-400" />
                </span>
                <input
                  {...register("password")}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
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
              <p className='text-red-500 text-sm font-medium mt-1 min-h-5'>{errors.password?.message}</p>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-linear-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-blue-500/25"
            >
              {loading ? (<p className='bg-blue-900 w-full h-full'>Signing...</p>) : (<p>Sign In</p>)}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Register as College
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-500">
            By signing in, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;