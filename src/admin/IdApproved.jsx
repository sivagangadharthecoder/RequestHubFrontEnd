import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const IdApproved = () => {
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

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { page, limit } = pagination;
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/id-requests`,
        {
          params: {
            status: 'approved',
            page,
            limit,
            search
          }
        }
      );

      setRequests(response.data.requests);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.totalPages,
        totalRecords: response.data.totalRecords || response.data.totalItems
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

  const handleStatusChange = async (id, status) => {
    try {
      setRequests(prevRequests =>
        prevRequests.map(request =>
          request._id === id ? { ...request, status } : request
        )
      );

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/id-requests/${id}`,
        { status }
      );

      const statusMessages = {
        approved: {
          title: 'Success',
          body: 'Application Approval Success !'
        },
        rejected: {
          title: 'Success',
          body: 'Application Rejection Success !'
        }
      };

      addToast(
        statusMessages[status] || {
          title: 'Status Updated !',
          body: `Request Status Changed To ${status} !`
        },
        'success'
      );

    } catch (error) {
      console.error('Error Updating Status:', error);

      const errorMessages = {
        approved: {
          title: 'Error',
          body: 'Application Approval Failed !'
        },
        rejected: {
          title: 'Error',
          body: 'Application Rejection Failed !'
        }
      };

      addToast(
        errorMessages[status] || {
          title: 'Status Updation Failed !',
          body: 'Failed to Update Request Status !'
        },
        'error'
      );

      fetchRequests();
    }
  };

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
          { title: 'Error', body: 'Application Deletion Failed !' },
          'error'
        );
      }
    }
  };

  const downloadPdf = (id) => {
    addToast(
      {
        title: 'Info',
        body: 'File Downloading..'
      },
      'info'
    );

    setTimeout(() => {
      window.open(`${import.meta.env.VITE_API_URL}/api/id-requests/pdf/${id}`, '_blank');
    }, 1500);
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
    <div className="zara-admin-content-wrapper">
      <div className="zara-admin-header">
        <h1 className="zara-admin-title">ID Card Approved</h1>
        <div className="zara-admin-controls">
          <div className="zara-search-wrapper">
            <input
              type="text"
              placeholder="Search requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="zara-search-input"
            />
          </div>

          <div className="zara-rows-selector">
            <select
              value={pagination.limit}
              onChange={(e) => handleLimitChange(e.target.value)}
              className="zara-rows-select"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span className="zara-rows-label">entries</span>
          </div>
        </div>
      </div>

      <div className="zara-table-wrapper">
        {loading ? (
          <div className="zara-loading-state">
            <div className="zara-loading-spinner"></div>
            <span>Loading requests...</span>
          </div>
        ) : (
          <table className="zara-data-table">
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
                  <td className="zara-reason-cell">{request.reason}</td>
                  <td>{new Date(request.requestDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`zara-status-badge ${request.status || 'pending'}`}>
                      {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'Pending'}
                    </span>
                  </td>
                  <td className="zara-actions-cell">
                    <div className="zara-action-buttons">
                      <button
                        onClick={() => handleStatusChange(request._id, 'approved')}
                        className={`zara-action-btn zara-approve ${request.status === 'approved' ? 'zara-disabled' : ''}`}
                        disabled={request.status === 'approved'}
                        title="Approve"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => handleStatusChange(request._id, 'rejected')}
                        className={`zara-action-btn zara-reject ${request.status === 'rejected' ? 'zara-disabled' : ''}`}
                        disabled={request.status === 'rejected'}
                        title="Reject"
                      >
                        ✕
                      </button>
                      <button
                        onClick={() => downloadPdf(request._id)}
                        className="zara-action-btn zara-download"
                        title="Download"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => handleDelete(request._id)}
                        className="zara-action-btn zara-delete"
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="zara-pagination">
        <div className="zara-pagination-controls">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="zara-pagination-btn"
          >
            Previous
          </button>
          <span className="zara-page-indicator">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="zara-pagination-btn"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdApproved;