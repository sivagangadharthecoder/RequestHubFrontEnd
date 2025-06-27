import { Routes, Route } from 'react-router-dom';
import './index.css';
import { ToastProvider } from './context/ToastContext';

import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import UserProfile from './components/UserProfile'

import Dashboard from './components/Dashboard';
import Internship from './components/Internship';
import Hackathon from './components/Hackathon';
import Leave from './components/Leave';
import Id from './components/Id';
import UserInternship from './student/UserInternship';
import UserHackathon from './student/UserHackathon';
import UserLeave from './student/UserLeave';
import UserId from './student/UserId';
import UserHackthonApproved from './student/UserHackathonApproved';
import UserHackthonRejected from './student/UserHackthonRejected';
import UserHackthonPending from './student/UserHackthonPending';
import UserInternshipApproved from './student/UserInternshipApproved';
import UserInternshipRejected from './student/UserInternshipRejected';
import UserInternshipPending from './student/UserInternshipPending';
import UserLeaveApproved from './student/UserLeaveApproved';
import UserLeaveRejected from './student/UserLeaveRejected';
import UserLeavePending from './student/UserLeavePending';
import UserIdApproved from './student/UserIdApproved';
import UserIdRejected from './student/UserIdRejected';
import UserIdPending from './student/UserIdPending';
import ChangeUsername from './student/ChangeUsername'

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminDashboardOverview from './components/AdminOverview';
import AllRequests from './pages/AllRequests';
import InternshipTable from './components/InternshipTable';
import HackathonTable from './components/HackathonTable';
import AdminIdRequests from './components/AdminIdRequests';
import LeaveTable from './components/LeaveTable';
import HackthonApproved from './admin/HackthonApproved';
import HackthonRejected from './admin/HackthonRejected';
import HackthonPending from './admin/HackthonPending';
import InternshipApproved from './admin/InternshipApproved';
import InternshipRejected from './admin/InternshipRejected';
import InternshipPending from './admin/InternshipPending';
import LeaveApproved from './admin/LeaveApproved';
import LeaveRejected from './admin/LeaveRejected';
import LeavePending from './admin/LeavePending';
import IdApproved from './admin/IdApproved';
import IdRejected from './admin/IdRejected';
import IdPending from './admin/IdPending';

import ResetPasswordAdmin from './admin/ResetPasswordAdmin';
import AdminAdding from './admin/AdminAdding';


const App = () => {
  return (
    <div>
      <ToastProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/email-verify' element={<EmailVerify />} />
          <Route path='/reset-password' element={<ResetPassword />} />

          <Route path='/reset-password-admin' element={<ResetPasswordAdmin />} />
          <Route path='/admin-adding' element={<AdminAdding />} />

          <Route path='/about' element={<AboutPage />} />
          <Route path='/contact' element={<ContactPage />} />

          <Route path="/admin/requests" element={<AllRequests />} />
          <Route path='/adminlogin' element={<AdminLogin />} />
          <Route path='/admin-overview' element={<AdminDashboardOverview />} />
          <Route path='/admin-dashboard' element={<AdminDashboard />} >
            <Route index element={<AdminDashboardOverview />} />

            <Route path='internship-table' element={<InternshipTable />} />
            <Route path='hackathon-table' element={<HackathonTable />} />
            <Route path='id-table' element={<AdminIdRequests />} />
            <Route path='leave-table' element={<LeaveTable />} />
            <Route path='hackathon-table-approved' element={<HackthonApproved />} />
            <Route path='hackathon-table-rejected' element={<HackthonRejected />} />
            <Route path='hackathon-table-pending' element={<HackthonPending />} />
            <Route path='internship-table-approved' element={<InternshipApproved />} />
            <Route path='internship-table-rejected' element={<InternshipRejected />} />
            <Route path='internship-table-pending' element={<InternshipPending />} />
            <Route path='leave-table-approved' element={<LeaveApproved />} />
            <Route path='leave-table-rejected' element={<LeaveRejected />} />
            <Route path='leave-table-pending' element={<LeavePending />} />
            <Route path='id-table-approved' element={<IdApproved />} />
            <Route path='id-table-rejected' element={<IdRejected />} />
            <Route path='id-table-pending' element={<IdPending />} />
          </Route >


          <Route path='/student-dashboard' element={<Dashboard />} >
            <Route path='internship-form' element={<Internship />} />
            <Route path='hackathon-form' element={<Hackathon />} />
            <Route path='leave-form' element={<Leave />} />
            <Route path='id-form' element={<Id />} />
            <Route path='internship-table-user' element={<UserInternship />} />
            <Route path='hackathon-table-user' element={<UserHackathon />} />
            <Route path='leave-table-user' element={<UserLeave />} />
            <Route path='id-table-user' element={<UserId />} />
            <Route path='hackathon-table-user-approved' element={<UserHackthonApproved />} />
            <Route path='hackathon-table-user-rejected' element={<UserHackthonRejected />} />
            <Route path='hackathon-table-user-pending' element={<UserHackthonPending />} />
            <Route path='internship-table-user-approved' element={<UserInternshipApproved />} />
            <Route path='internship-table-user-rejected' element={<UserInternshipRejected />} />
            <Route path='internship-table-user-pending' element={<UserInternshipPending />} />
            <Route path='leave-table-user-approved' element={<UserLeaveApproved />} />
            <Route path='leave-table-user-rejected' element={<UserLeaveRejected />} />
            <Route path='leave-table-user-pending' element={<UserLeavePending />} />
            <Route path='id-table-user-approved' element={<UserIdApproved />} />
            <Route path='id-table-user-rejected' element={<UserIdRejected />} />
            <Route path='id-table-user-pending' element={<UserIdPending />} />
            <Route path='profile' element={<UserProfile />} />

          </Route >
          <Route path='/changeusername' element={<ChangeUsername />} />
        </Routes>
      </ToastProvider>

    </div>
  );
};

export default App;