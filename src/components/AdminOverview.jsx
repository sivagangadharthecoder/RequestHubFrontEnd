import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminDashboardOverview.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminDashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [lastLogin, setLastLogin] = useState(null);
  const [userRole, setUserRole] = useState('admin');
  const [bulkDays, setBulkDays] = useState(3);
  const [bulkType, setBulkType] = useState("hackathon");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard-overview`, { withCredentials: true });
        setStats(res.data);
        const mockLastLogin = new Date();
        mockLastLogin.setHours(mockLastLogin.getHours() - 4);
        setLastLogin(mockLastLogin.toString());
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };
    fetchSummary();
  }, []);

  const handleBulkApprove = async () => {
    try {
      const res = await axios.post('/api/admin/bulk-approve-ids', {
        type: bulkType,
        daysAhead: parseInt(bulkDays),
      });
      const pendingIds = res.data.ids;
      if (!pendingIds || pendingIds.length === 0) {
        return Swal.fire({
          icon: 'info',
          title: 'No Requests',
          text: 'No pending requests found for selected criteria.',
        });
      }
      for (let i = 0; i < pendingIds.length; i++) {
        await handleApprove(pendingIds[i]);
      }
      Swal.fire({
        icon: 'success',
        title: 'Bulk Approved!',
        text: `${pendingIds.length} ${bulkType} requests successfully approved.`,
      });
    } catch (err) {
      console.error("Bulk approval failed:", err);
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: err.response?.data?.error || 'Something went wrong!',
      });
    }
  };

  return (
    <div className="admin-overview-container">
      <h2 className="admin-welcome">Welcome, Admin!</h2>
      {lastLogin && (
        <p className="last-login">Last login: {new Date(lastLogin).toLocaleString()}</p>
      )}
      <div className="dashboard-layout">
        <div className="action-header">
          <button className="view-all-btn" onClick={() => navigate("/admin/requests")}>
            <span className="view-all-icon"></span> View All Requests
          </button>
        </div>
        {stats ? (
          <div className="overview-grid">
            <div className="overview-card">
              <h3>Internship Requests</h3>
              <p>{stats.internshipCount}</p>
            </div>
            <div className="overview-card">
              <h3>ID Card Requests</h3>
              <p>{stats.idCount}</p>
            </div>
            <div className="overview-card">
              <h3>Leave Requests</h3>
              <p>{stats.leaveCount}</p>
            </div>
            <div className="overview-card">
              <h3>Hackathon Requests</h3>
              <p>{stats.hackathonCount}</p>
            </div>
            <div className="overview-card approved">
              <h3>Approved</h3>
              <p>{stats.approvedCount}</p>
            </div>
            <div className="overview-card pending">
              <h3>Pending</h3>
              <p>{stats.pendingCount}</p>
            </div>
            <div className="overview-card rejected">
              <h3>Rejected</h3>
              <p>{stats.rejectedCount}</p>
            </div>
          </div>
        ) : (
          <p className="loading-text">Loading dashboard...</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardOverview;