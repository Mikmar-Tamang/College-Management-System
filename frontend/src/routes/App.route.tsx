import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {lazy, Suspense} from 'react';

const Login = lazy(() => import('../pages/login/Login'));
const VerifyEmail = lazy(() => import('../pages/VerifyEmail'));
const Home = lazy(() => import('../pages/home/Home'));
const Register = lazy(() => import('../pages/register/Register'));
const VerifyNotice = lazy(() => import('../pages/VerifyNotice'));
const ForgotPassword = lazy(() => import('../pages/forgot-password/ForgotPassword'));
const VerifyResetCode = lazy(() => import('../pages/forgot-password/VerifyResetCode'));
const ResetPassword = lazy(() => import('../pages/forgot-password/ResetPassword'));
const ProfilePage = lazy(() => import('../pages/home/ProfilePage'));
const ChangePassword = lazy(() => import('../pages/home/ChangePassword'));
const ProtectedRoute = lazy(() => import('../routes/ProtectedRoute'));
const PendingApproval = lazy(() => import('../pages/PendingApproval'));
const SuperAdminHome = lazy(() => import('../pages/super-admin/SuperAdminHome'));

function AppRoute() {
  return (
    <BrowserRouter>
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/verify-email" element={<VerifyEmail/>}/>
        <Route path="/verify-notice" element={<VerifyNotice/>} />
        <Route path="/pending-approval" element={<PendingApproval/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/verify-reset-code" element={<VerifyResetCode/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />

        {/* Protected Routes — require login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home/>}/>
          <Route path="/super-admin" element={<SuperAdminHome/>}/>
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/change-password" element={<ChangePassword/>}/>
        </Route>
      </Routes>
    </Suspense>
    </BrowserRouter>
  )
}

export default AppRoute;
