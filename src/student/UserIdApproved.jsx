import { useState, useEffect } from 'react';
import axios from 'axios';
import { useContext } from "react";
import { AppContent } from "../context/AppContext";
import { useToast } from '../context/ToastContext';

const UserIdApproved = () => {
  const { addToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 0
  });

  const { userData } = useContext(AppContent);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { page, limit } = pagination;
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/id-requests`,
        {
          params: {
            page,
            limit,
            search,
          }
        }
      );

      const filteredRequests = response.data.requests.filter(
        request => request.rollNumber === userData.rollNumber && request.status === 'approved'
      );

      setRequests(filteredRequests);

      setPagination(prev => ({
        ...prev,
        totalPages: response.data.totalPages,
        totalItems: response.data.totalItems
      }));
    } catch (error) {
      console.error('Error Fetching Requests:', error);
      addToast(
        {
          title: 'Error',
          body: "Failed To Fetch !"
        },
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [pagination.page, pagination.limit, search]);

  const handleDelete = async (id) => {
    if (window.confirm('Are You Sure ?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/id-requests/${id}`);
        addToast(
          { title: 'Success', body: 'Application Deletion Success !' },
          'success'
        );
        fetchRequests();
      } catch (error) {
        console.error('Error Deleting Request:', error);
        addToast(
          {
            title: 'Error',
            body: "Application Deletion Failed !"
          },
          'error'
        );
      }
    }
  };

  const downloadPdf = (id) => {
    window.open(`${import.meta.env.VITE_API_URL}/api/id-requests/pdf/${id}`, '_blank');
    addToast(
      { title: 'Info', body: 'File Downloading.. !' },
      'info'
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({
      ...prev,
      limit: parseInt(newLimit),
      page: 1
    }));
  };

  return (
    <div className="dashboard-content-container">
      <div className="dashboard-main-section">
        <h2>Your ID Card Requests (Approved)</h2>
        <div className="dashboard-table-controls">
          <div className="dashboard-search-wrapper">
            <input
              type="text"
              placeholder="Search requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="dashboard-search-input"
            />
          </div>
          <div className="dashboard-rows-selector">
            <select
              value={pagination.limit}
              onChange={(e) => handleLimitChange(e.target.value)}
              className="dashboard-rows-select"
            >
              <option value="5">5 rows</option>
              <option value="10">10 rows</option>
              <option value="20">20 rows</option>
              <option value="50">50 rows</option>
            </select>
          </div>
        </div>
        <div className="dashboard-table-wrapper">
          {loading ? (
            <div className="dashboard-loading-state">
              <div className="dashboard-loading-spinner"></div>
              <span>Loading requests...</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="dashboard-no-results">
              No approved ID card requests found
            </div>
          ) : (
            <div className="dashboard-table-responsive">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Roll No.</th>
                    <th>Department</th>
                    <th>College</th>
                    <th>Reason</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(request => (
                    <tr key={request._id}>
                      <td>{request.studentName}</td>
                      <td>{request.rollNumber}</td>
                      <td>{request.department}</td>
                      <td>{request.college}</td>
                      <td className="dashboard-table-reason">{request.reason}</td>
                      <td>{new Date(request.requestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td>
                        <span className={`dashboard-status-badge ${request.status || 'pending'}`}>
                          {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'Pending'}
                        </span>
                      </td>
                      <td className="dashboard-table-actions">
                        <button
                          onClick={() => downloadPdf(request._id)}
                          className="dashboard-action-btn download"
                          title="Download"
                        >
                          <i>⬇️</i>
                        </button>
                        <button
                          onClick={() => handleDelete(request._id)}
                          className="dashboard-action-btn delete"
                          title="Delete"
                        >
                          <i>🗑️</i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {requests.length > 0 && (
          <div className="dashboard-pagination">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="dashboard-pagination-btn"
            >
              Previous
            </button>
            <span className="dashboard-page-indicator">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="dashboard-pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        :root {
          --primary-dark: #213448;
          --accent-teal: #547792;
          --accent-blue: #94B4C1;
          --neutral-light: #f8fafc;
          --neutral-border: #e2e8f0;
          --neutral-text-secondary: #64748b;
          --success-green: #10b981;
          --danger-red: #ef4444;
          --neutral-gray: #6b7280;
          --info-blue: #3b82f6;
          --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
          --shadow-md: 0 6px 20px rgba(0, 0, 0, 0.15);
          --transition-ease: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dashboard-content-container {
          width: 100%;
          padding: 40px;
          background: linear-gradient(180deg, var(--primary-dark) 0%, #172638 100%);
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: var(--neutral-text-secondary);
        }

        .dashboard-main-section {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: var(--shadow-md);
          padding: 24px;
          margin-bottom: 24px;
          animation: slideInUp 0.6s ease-out;
        }

        .dashboard-main-section h2 {
          color: var(--primary-dark);
          font-size: 2rem;
          font-weight: 600;
          margin: 0 0 24px;
          position: relative;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .dashboard-main-section h2::after {
          content: '';
          width: 60px;
          height: 4px;
          background: linear-gradient(90deg, var(--accent-teal), var(--accent-blue));
          position: absolute;
          bottom: -8px;
          left: 0;
          border-radius: 2px;
        }

        .dashboard-table-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .dashboard-search-wrapper {
          flex: 1;
          max-width: 360px;
          position: relative;
        }

        .dashboard-search-input {
          width: 100%;
          padding: 12px 40px 12px 16px;
          border: 1px solid var(--neutral-border);
          border-radius: 10px;
          font-size: 0.875rem;
          color: var(--primary-dark);
          background: var(--neutral-light);
          transition: var(--transition-ease);
        }

        .dashboard-search-input:focus {
          outline: none;
          border-color: var(--accent-teal);
          box-shadow: 0 0 0 3px rgba(84, 119, 146, 0.1);
        }

        .dashboard-search-input::placeholder {
          color: var(--neutral-text-secondary);
          opacity: 0.7;
        }

        .dashboard-search-wrapper::before {
          content: '🔍';
          position: absolute;
          top: 50%;
          right: 16px;
          transform: translateY(-50%);
          color: var(--neutral-text-secondary);
          font-size: 1rem;
        }

        .dashboard-rows-selector {
          display: flex;
          align-items: center;
        }

        .dashboard-rows-select {
          padding: 8px 12px;
          border: 1px solid var(--neutral-border);
          border-radius: 10px;
          font-size: 0.875rem;
          color: var(--primary-dark);
          background: #ffffff;
          cursor: pointer;
          transition: var(--transition-ease);
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.5rem center;
          background-size: 1em;
        }

        .dashboard-rows-select:focus {
          outline: none;
          border-color: var(--accent-teal);
          box-shadow: 0 0 0 3px rgba(84, 119, 146, 0.1);
        }

        .dashboard-table-wrapper {
          width: 100%;
          overflow-x: auto;
          margin-bottom: 24px;
        }

        .dashboard-table-responsive {
          min-width: 800px;
          width: 100%;
        }

        .dashboard-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          font-size: 0.875rem;
        }

        .dashboard-table th {
          background: linear-gradient(180deg, var(--neutral-light) 0%, #edf2f7 100%);
          color: var(--primary-dark);
          font-weight: 500;
          padding: 14px 20px;
          text-align: left;
          border-bottom: 1px solid var(--neutral-border);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          white-space: nowrap;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .dashboard-table td {
          padding: 14px 20px;
          border-bottom: 1px solid var(--neutral-border);
          vertical-align: middle;
          color: var(--neutral-text-secondary);
          font-size: 0.875rem;
          transition: background 0.2s ease;
        }

        .dashboard-table tr:last-child td {
          border-bottom: none;
        }

        .dashboard-table tr:hover td {
          background: rgba(248, 250, 252, 0.5);
        }

        .dashboard-table-reason {
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dashboard-status-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: var(--transition-ease);
        }

        .dashboard-status-badge:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .dashboard-status-badge.pending {
          background: #fef3c7;
          color: #b45309;
        }

        .dashboard-status-badge.approved {
          background: #d1fae5;
          color: #065f46;
        }

        .dashboard-status-badge.rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .dashboard-table-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .dashboard-action-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          background: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          transition: var(--transition-ease);
          box-shadow: var(--shadow-sm);
          position: relative;
          overflow: hidden;
        }

        .dashboard-action-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: 0.4s;
        }

        .dashboard-action-btn:hover::before {
          left: 100%;
        }

        .dashboard-action-btn.download {
          background: linear-gradient(90deg, var(--info-blue), #60a5fa);
          color: #ffffff;
        }

        .dashboard-action-btn.download:hover {
          background: linear-gradient(90deg, #2563eb, var(--info-blue));
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .dashboard-action-btn.delete {
          background: linear-gradient(90deg, var(--danger-red), #f87171);
          color: #ffffff;
        }

        .dashboard-action-btn.delete:hover {
          background: linear-gradient(90deg, #dc2626, var(--danger-red));
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }

        .dashboard-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 24px;
        }

        .dashboard-pagination-btn {
          padding: 8px 16px;
          border: 1px solid var(--neutral-border);
          background: #ffffff;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          color: var(--primary-dark);
          transition: var(--transition-ease);
          box-shadow: var(--shadow-sm);
        }

        .dashboard-pagination-btn:hover:not(:disabled) {
          background: linear-gradient(90deg, var(--accent-teal), var(--accent-blue));
          color: #ffffff;
          border-color: transparent;
          box-shadow: 0 4px 12px rgba(84, 119, 146, 0.3);
        }

        .dashboard-pagination-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .dashboard-page-indicator {
          font-size: 0.875rem;
          color: var(--accent-blue);
          font-weight: 500;
        }

        .dashboard-loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
          gap: 8px;
          color: var(--accent-blue);
          font-size: 1rem;
          font-weight: 500;
          animation: fadeIn 0.6s ease-out;
        }

        .dashboard-loading-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid var(--neutral-border);
          border-top-color: var(--accent-teal);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .dashboard-no-results {
          padding: 48px;
          text-align: center;
          color: var(--accent-blue);
          font-size: 1rem;
          font-weight: 500;
          animation: fadeIn 0.6s ease-out;
        }

        @media (max-width: 1024px) {
          .dashboard-content-container {
            padding: 24px;
          }
          
          .dashboard-main-section {
            padding: 20px;
          }
          
          .dashboard-main-section h2 {
            font-size: 1.75rem;
          }
          
          .dashboard-table-controls {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          
          .dashboard-search-wrapper {
            max-width: 100%;
          }
        }

        @media (max-width: 768px) {
          .dashboard-content-container {
            padding: 16px;
          }
          
          .dashboard-main-section {
            padding: 16px;
          }
          
          .dashboard-main-section h2 {
            font-size: 1.5rem;
          }
          
          .dashboard-table th,
          .dashboard-table td {
            padding: 12px 16px;
            font-size: 0.75rem;
          }
          
          .dashboard-action-btn {
            width: 28px;
            height: 28px;
            font-size: 0.75rem;
          }
          
          .dashboard-pagination-btn {
            padding: 6px 12px;
            font-size: 0.75rem;
          }
        }

        @media (max-width: 480px) {
          .dashboard-content-container {
            padding: 12px;
          }
          
          .dashboard-main-section h2 {
            font-size: 1.25rem;
          }
          
          .dashboard-search-input {
            padding: 10px 36px 10px 12px;
            font-size: 0.75rem;
          }
          
          .dashboard-rows-select {
            padding: 6px 10px;
            font-size: 0.75rem;
          }
          
          .dashboard-table th,
          .dashboard-table td {
            padding: 8px 12px;
            font-size: 0.625rem;
          }
          
          .dashboard-action-btn {
            width: 24px;
            height: 24px;
            font-size: 0.625rem;
          }
          
          .dashboard-pagination-btn {
            padding: 4px 8px;
            font-size: 0.625rem;
          }
        }

        /* Animations */
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UserIdApproved;