import { useNavigate } from "react-router-dom";
import { FaHourglassHalf, FaCheckCircle, FaSignInAlt } from "react-icons/fa";

function PendingApproval() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-lg backdrop-filter border border-white/10 rounded-2xl shadow-2xl p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="bg-amber-500/10 p-5 rounded-full">
                <FaHourglassHalf className="text-4xl text-amber-400 animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 bg-green-500 p-1.5 rounded-full">
                <FaCheckCircle className="text-xs text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-2">
            Email Verified Successfully!
          </h1>
          <p className="text-green-400 text-sm mb-6 flex items-center justify-center gap-1">
            <FaCheckCircle className="text-xs" />
            Your email has been verified
          </p>

          {/* Status Message */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 mb-6">
            <h2 className="text-lg font-semibold text-amber-400 mb-2">
              Waiting for Approval
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your registration is currently under review by the super admin. 
              You will be able to log in once your account has been approved.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-3 mb-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-400 text-xs font-bold">✓</span>
              </div>
              <p className="text-gray-300 text-sm">Account created</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-400 text-xs font-bold">✓</span>
              </div>
              <p className="text-gray-300 text-sm">Email verified</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                <FaHourglassHalf className="text-amber-400 text-xs" />
              </div>
              <p className="text-amber-300 text-sm font-medium">Pending admin approval</p>
            </div>
            <div className="flex items-center gap-3 opacity-40">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-500 text-xs">4</span>
              </div>
              <p className="text-gray-500 text-sm">Access granted</p>
            </div>
          </div>

          {/* Back to Login */}
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 px-4 bg-white/10 border border-white/20 text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FaSignInAlt />
            Back to Login
          </button>

          {/* Footer */}
          <p className="mt-5 text-center text-xs text-gray-500">
            You'll receive access once the super admin approves your registration.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PendingApproval;
