import { useLocation, useNavigate } from "react-router-dom";
import { FaEnvelopeOpenText, FaArrowRight, FaCheckCircle } from "react-icons/fa";

function VerifyNotice() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "your email";

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-lg backdrop-filter border border-white/10 rounded-2xl shadow-2xl p-8 text-center">
          {/* Mail Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="bg-blue-500/10 p-6 rounded-full">
                <FaEnvelopeOpenText className="text-5xl text-blue-400 animate-bounce" />
              </div>
              <div className="absolute -top-1 -right-1 bg-amber-500 p-1.5 rounded-full animate-pulse">
                <span className="text-white text-xs font-bold">1</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-2">
            Check Your Email
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            We've sent a verification link to
          </p>

          {/* Email Display */}
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-6">
            <p className="text-blue-400 font-medium text-sm break-all">{email}</p>
          </div>

          {/* Instructions */}
          <div className="space-y-3 mb-6 text-left">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-xs font-bold">1</span>
              </div>
              <p className="text-gray-300 text-sm">
                Open your <span className="text-white font-medium">Gmail</span> inbox
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-xs font-bold">2</span>
              </div>
              <p className="text-gray-300 text-sm">
                Find the email from <span className="text-white font-medium">College Management</span>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-xs font-bold">3</span>
              </div>
              <p className="text-gray-300 text-sm">
                Click the <span className="text-white font-medium">"Verify Email"</span> button in the email
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex items-center gap-1">
              <FaCheckCircle className="text-green-400 text-sm" />
              <span className="text-green-400 text-xs">Registered</span>
            </div>
            <FaArrowRight className="text-gray-600 text-xs" />
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 border-2 border-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-400 text-xs font-medium">Verify Email</span>
            </div>
            <FaArrowRight className="text-gray-600 text-xs" />
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 border-2 border-gray-600 rounded-full"></div>
              <span className="text-gray-500 text-xs">Approval</span>
            </div>
          </div>

          {/* Open Gmail Button */}
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-linear-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 mb-3"
          >
            <FaEnvelopeOpenText />
            Open Gmail
          </a>

          {/* Back to Login */}
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 px-4 bg-white/5 border border-white/10 text-gray-300 font-medium rounded-lg hover:bg-white/10 transition-all duration-200 text-sm"
          >
            Back to Login
          </button>

          {/* Footer */}
          <p className="mt-5 text-center text-xs text-gray-500">
            Didn't receive the email? Check your spam folder or try registering again.
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyNotice;
