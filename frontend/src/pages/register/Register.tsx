import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { RegisterForm } from '../../types/auth';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaPhone, 
  FaBuilding, 
  FaMapMarkerAlt,
  FaIdCard,
  FaSchool,
  FaInfoCircle,
  FaTimes
} from 'react-icons/fa';

const schema = yup.object().shape({
  admin_name: yup.string().required("Admin name is required").min(2, "Min 2 characters"),
  email: yup.string().email("Invalid email").required("Admin email is required"),
  password: yup.string().required("Password is required").min(8, "Min 8 characters").max(12, "Max 12 characters"),
  phone_number: yup.string().required("Phone number is required").min(10, "Must be 10 digits").max(10, "Must be 10 digits"),
  collegeName: yup.string().required("College name is required"),
  collegeAddress: yup.string().required("College address is required"),
  collegeCode: yup.string().required("College code is required"),
  collegeEmail: yup.string().email("Invalid email").required("College email is required"),
  collegePhoneNumber: yup.string().required("College phone is required").min(10, "Must be 10 digits").max(10, "Must be 10 digits"),
});

function Register() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword]= useState<string>("");
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false);
  const [error, setError]= useState<string>("");
  const [loading, setLoading]= useState<boolean>(false);

  const navigate= useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({ resolver: yupResolver(schema) });

  const onSubmit= async(data: RegisterForm)=>{
    try{
      setLoading(true);
      if(data.password !== confirmPassword){
       setError("Confirm password does'nt  matched");
       return
      }
    await axios.post(import.meta.env.VITE_API_URL+"/api/auth/register", data,{
      withCredentials:true
    })
       console.log("register has been done");
    navigate("/verify-notice", { state: { email: data.email } })
    }catch(err){
      console.log(err)
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-2 sm:p-4 overflow-hidden">
      <div className="w-full max-w-4xl mx-auto h-full flex items-center justify-center">
        
        {/* Registration Card - Full Height Fit */}
        <div className="bg-white/5 backdrop-blur-lg backdrop-filter border border-white/10 rounded-xl sm:rounded-2xl shadow-2xl w-full max-h-[98vh] sm:max-h-[95vh] overflow-y-auto p-3 sm:p-4 md:p-6">
          
          {/* Logo - Compact */}
          <div className="text-center mb-1 sm:mb-2">
            <div className="flex justify-center mb-1">
              <div className="bg-linear-to-r from-blue-500 to-purple-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg shadow-blue-500/20">
                <FaSchool className="text-lg sm:text-4xl text-white" />
              </div>
            </div>
            <h1 className="text-base sm:text-lg md:text-4xl font-bold text-white">College Registration</h1>
            <p className="text-gray-400 md:text-[15px] sm:text-xs mt-2.5">Register your college to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-1.5 sm:space-y-2">
            {/* Admin Information */}
            <div>
              <h3 className="md:text-[15px] sm:text-xs font-semibold text-blue-400 uppercase tracking-wider border-b border-gray-700 pb-1 mb-1.5">
                Admin Information
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-2">
                {/* Full Name */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-gray-300 md:text-[15px] sm:text-xs font-medium mb-0.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 sm:pl-2">
                      <FaUser className="text-gray-400 text-[8px] sm:text-[10px]" />
                    </span>
                    <input
                    {...register("admin_name")}
                      type="text"
                      placeholder="admin name"
                      className="w-full pl-5 sm:pl-7 pr-2 py-1 sm:py-1.5 bg-[#1e293b] border border-gray-600/50 rounded text-white placeholder-gray-400 text-[10px] sm:text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                    />
                  </div>
                   {errors.admin_name && <p className="text-red-400 text-xs mt-1">{errors.admin_name.message}</p>}
                </div>

                {/* Admin Email */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-gray-300 md:text-[15px] sm:text-xs font-medium mb-0.5">
                    Admin Email <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 sm:pl-2">
                      <FaEnvelope className="text-gray-400 text-[8px] sm:text-[10px]" />
                    </span>
                    <input
                    {...register("email")}
                      type="email"
                      placeholder="admin@college.edu.np"
                      className="w-full pl-5 sm:pl-7 pr-2 py-1 sm:py-1.5 bg-[#1e293b] border border-gray-600/50 rounded text-white placeholder-gray-400 text-[10px] sm:text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                    />
                  </div>
                   {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-gray-300 md:text-[15px] sm:text-xs font-medium mb-0.5">
                    Phone <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 sm:pl-2">
                      <FaPhone className="text-gray-400 text-[8px] sm:text-[10px]" />
                    </span>
                    <input
                    {...register("phone_number")}
                      type="text"
                      placeholder="9812345678"
                      className="w-full pl-5 sm:pl-7 pr-2 py-1 sm:py-1.5 bg-[#1e293b] border border-gray-600/50 rounded text-white placeholder-gray-400 text-[10px] sm:text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                    />
                  </div>
                   {errors.phone_number && <p className="text-red-400 text-xs mt-1">{errors.phone_number.message}</p>}
                </div>

                {/* Password */}
                <div className="col-span-1">
                  <label className="block text-gray-300 md:text-[15px] sm:text-xs font-medium mb-0.5">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 sm:pl-2">
                      <FaLock className="text-gray-400 text-[8px] sm:text-[10px]" />
                    </span>
                    <input
                    {...register("password")}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="********"
                      className="w-full pl-5 sm:pl-7 pr-6 sm:pr-7 py-1 sm:py-1.5 bg-[#1e293b] border border-gray-600/50 rounded text-white placeholder-gray-400 text-[10px] sm:text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-1.5 sm:pr-2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <FaEyeSlash className="text-[8px] sm:text-[10px]" /> : <FaEye className="text-[8px] sm:text-[10px]" />}
                    </button>
                  </div>
                   {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div className="col-span-1">
                  <label className="block text-gray-300 md:text-[15px] sm:text-xs font-medium mb-0.5">
                    Confirm <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 sm:pl-2">
                      <FaLock className="text-gray-400 text-[8px] sm:text-[10px]" />
                    </span>
                    <input
                    // {...register("confirmPassword")}
                     value={confirmPassword}
                     onChange={(e)=>{setConfirmPassword(e.target.value)}}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="********"
                      className="w-full pl-5 sm:pl-7 pr-6 sm:pr-7 py-1 sm:py-1.5 bg-[#1e293b] border border-gray-600/50 rounded text-white placeholder-gray-400 text-[10px] sm:text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-1.5 sm:pr-2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? <FaEyeSlash className="text-[8px] sm:text-[10px]" /> : <FaEye className="text-[8px] sm:text-[10px]" />}
                    </button>
                  </div>
                  {error && (
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  )}
                </div>
              </div>
            </div>

            {/* College Information */}
            <div>
              <h3 className="md:text-[15px] sm:text-xs font-semibold text-purple-400 uppercase tracking-wider border-b border-gray-700 pb-1 mb-1.5">
                College Information
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-1.5 sm:gap-2">
                {/* College Name */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-gray-300 md:text-[15px] sm:text-xs font-medium mb-0.5">
                    College Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 sm:pl-2">
                      <FaBuilding className="text-gray-400 text-[8px] sm:text-[10px]" />
                    </span>
                    <input
                    {...register("collegeName")}
                      type="text"
                      placeholder="College name"
                      className="w-full pl-5 sm:pl-7 pr-2 py-1 sm:py-1.5 bg-[#1e293b] border border-gray-600/50 rounded text-white placeholder-gray-400 text-[10px] sm:text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                    />
                    {errors.collegeName && <p className="text-red-400 text-xs mt-1">{errors.collegeName.message}</p>}
                  </div>
                </div>

                {/* College Code */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-gray-300 md:text-[15px] sm:text-xs font-medium mb-0.5">
                    College Code <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 sm:pl-2">
                      <FaIdCard className="text-gray-400 text-[8px] sm:text-[10px]" />
                    </span>
                    <input
                    {...register("collegeCode")}
                      type="text"
                      placeholder="COL001"
                      className="w-full pl-5 sm:pl-7 pr-2 py-1 sm:py-1.5 bg-[#1e293b] border border-gray-600/50 rounded text-white placeholder-gray-400 text-[10px] sm:text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                    />
                    {errors.collegeCode && <p className="text-red-400 text-xs mt-1">{errors.collegeCode.message}</p>}
                  </div>
                </div>

                {/* College Email */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-gray-300 md:text-[15px] sm:text-xs font-medium mb-0.5">
                    College Email <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 sm:pl-2">
                      <FaEnvelope className="text-gray-400 text-[8px] sm:text-[10px]" />
                    </span>
                    <input
                    {...register("collegeEmail")}
                      type="email"
                      placeholder="info@college.edu.np"
                      className="w-full pl-5 sm:pl-7 pr-2 py-1 sm:py-1.5 bg-[#1e293b] border border-gray-600/50 rounded text-white placeholder-gray-400 text-[10px] sm:text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                    />
                    {errors.collegeEmail && <p className="text-red-400 text-xs mt-1">{errors.collegeEmail.message}</p>}
                  </div>
                </div>

                {/* College Phone */}
                <div className="col-span-1">
                  <label className="block text-gray-300 md:text-[15px] sm:text-xs font-medium mb-0.5">
                    College Phone <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 sm:pl-2">
                      <FaPhone className="text-gray-400 text-[8px] sm:text-[10px]" />
                    </span>
                    <input
                    {...register("collegePhoneNumber")}
                      type="text"
                      placeholder="01-1234567"
                      className="w-full pl-5 sm:pl-7 pr-2 py-1 sm:py-1.5 bg-[#1e293b] border border-gray-600/50 rounded text-white placeholder-gray-400 text-[10px] sm:text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                    />
                    {errors.collegePhoneNumber && <p className="text-red-400 text-xs mt-1">{errors.collegePhoneNumber.message}</p>}
                  </div>
                </div>

                {/* College Address */}
                <div className="col-span-1">
                  <label className="block text-gray-300 md:text-[15px] sm:text-xs font-medium mb-0.5">
                    Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 sm:pl-2">
                      <FaMapMarkerAlt className="text-gray-400 text-[8px] sm:text-[10px]" />
                    </span>
                    <input
                    {...register("collegeAddress")}
                      type="text"
                      placeholder="Kathmandu, Nepal"
                      className="w-full pl-5 sm:pl-7 pr-2 py-1 sm:py-1.5 bg-[#1e293b] border border-gray-600/50 rounded text-white placeholder-gray-400 text-[10px] sm:text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                    />
                    {errors.collegeAddress && <p className="text-red-400 text-xs mt-1">{errors.collegeAddress.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Submit - Compact */}
            <div className="flex flex-col items-center justify-between gap-2 pt-1 border-t border-gray-700/50">
              <div className="flex items-start flex-1">
                <input
                // {...register("checkTermsAndPrivacy")}
                  type="checkbox"
                  className="mt-0.5 mr-1 w-4 h-4  bg-[#1e293b] border-gray-600 rounded focus:ring-blue-500 focus:ring-1 shrink-0"
                />
                <label className="text-gray-400 md:text-[14px] sm:text-[10px] leading-tight">
                  I agree to{' '}
                  <span className="relative inline-block">
                    <button
                      type="button"
                      onClick={() => setShowTerms(!showTerms)}
                      className="text-blue-400 hover:text-blue-300 focus:outline-none md:text-[14px] sm:text-[10px]"
                    >
                      Terms
                      <FaInfoCircle className="inline ml-0.5 text-[6px] sm:text-[8px]" />
                    </button>
                    {showTerms && (
                      <div className="absolute z-50 bottom-full left-0 mb-1 w-48 sm:w-56 bg-[#1e293b] border border-gray-700 rounded-lg shadow-2xl p-2 sm:p-3">
                        <div className="flex justify-between items-start mb-1">
                          <div className="text-white font-semibold md:text-[15px] sm:text-xs">Terms</div>
                          <button type="button" onClick={() => setShowTerms(false)} className="text-gray-400 hover:text-white">
                            <FaTimes className="text-[8px] sm:text-[10px]" />
                          </button>
                        </div>
                        <ul className="text-gray-300 md:text-[15px] sm:text-[10px] list-disc pl-3 space-y-0.5">
                          <li>Provide accurate info</li>
                          <li>Use system responsibly</li>
                          <li>Keep credentials secure</li>
                        </ul>
                        <div className="absolute -bottom-1 left-4 w-1.5 h-1.5 bg-[#1e293b] border-r border-b border-gray-700 rotate-45"></div>
                      </div>
                    )}
                  </span>
                  {' & '}
                  <span className="relative inline-block">
                    <button
                      type="button"
                      onClick={() => setShowPrivacy(!showPrivacy)}
                      className="text-blue-400 hover:text-blue-300 focus:outline-none md:text-[14px] sm:text-[10px]"
                    >
                      Privacy
                      <FaInfoCircle className="inline ml-0.5 text-[6px] sm:text-[8px]" />
                    </button>
                    {showPrivacy && (
                      <div className="absolute z-50 bottom-full left-0 mb-1 w-48 sm:w-56 bg-[#1e293b] border border-gray-700 rounded-lg shadow-2xl p-2 sm:p-3">
                        <div className="flex justify-between items-start mb-1">
                          <div className="text-white font-semibold md:text-[14px] sm:text-xs">Privacy</div>
                          <button type="button" onClick={() => setShowPrivacy(false)} className="text-gray-400 hover:text-white">
                            <FaTimes className="text-[8px] sm:text-[10px]" />
                          </button>
                        </div>
                        <ul className="text-gray-300 text-[8px] sm:text-[10px] list-disc pl-3 space-y-0.5">
                          <li>Data is encrypted</li>
                          <li>Not shared with 3rd parties</li>
                          <li>You own your data</li>
                        </ul>
                        <div className="absolute -bottom-1 left-4 w-1.5 h-1.5 bg-[#1e293b] border-r border-b border-gray-700 rotate-45"></div>
                      </div>
                    )}
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="md:px-12 px-6 md:py-3 sm:py-1.5 bg-linear-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 md:text-[15px] sm:text-xs whitespace-nowrap"
              >
                {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit'
              )}
              </button>
            </div>

            {/* Login Link - Tiny */}
            <p className="text-center text-gray-400 md:text-[15px] sm:text-[10px]">
              Already have an account?{' '}
              <a href="/" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign In
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;