import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import '../styles/AdminIdRequests.css';

const AdminIdRequests = () => {
  const { addToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [buttonLoading, setButtonLoading] = useState({});
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
        `${import.meta.env.VITE_API_URL}/api/id-requests?page=${page}&limit=${limit}&search=${search}`
      );
      setRequests(response.data.requests);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.totalPages,
        totalItems: response.data.totalItems
      }));
    } catch (error) {
      console.error('Error Fetching Requests:', error);
      addToast({ title: 'Error', body: "Failed To Fetch !" }, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [pagination.page, pagination.limit, search]);

  const handleStatusChange = async (id, status) => {
    setButtonLoading(prev => ({ ...prev, [id]: status }));

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

      addToast({ title: 'Success', body: `Request ${status} Successfully !` }, 'success');
      fetchRequests();
    } catch (error) {
      console.error('Error Updating Status:', error);
      addToast({ title: 'Error', body: `Request ${status} Failed !` }, 'error');
      fetchRequests();
    } finally {
      setButtonLoading(prev => ({ ...prev, [id]: null }));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are You Sure ?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/id-requests/${id}`);
        addToast({ title: 'Success', body: 'Application Deletion Success !' }, 'success');
        fetchRequests();
      } catch (error) {
        console.error('Error Deleting Request:', error);
        addToast({ title: 'Error', body: "Application Deletion Failed !" }, 'error');
      }
    }
  };

  const downloadPdf = (id) => {
    window.open(`${import.meta.env.VITE_API_URL}/api/id-requests/pdf/${id}`, '_blank');
    addToast({ title: 'Info', body: 'File Downloading.. !' }, 'info');
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
    <div className="zara-admin-page">
      <div className="zara-page-header">
        <h2 className="zara-page-title">ID Card Requests</h2>
        <div className="zara-page-controls">
          <div className="zara-search-box">
            <input
              type="text"
              placeholder="Search requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="zara-search-input"
            />
          </div>

          <div className="zara-rows-select">
            <span className="zara-rows-text">Show</span>
            <select
              value={pagination.limit}
              onChange={(e) => handleLimitChange(e.target.value)}
              className="zara-select"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span className="zara-rows-text">entries</span>
          </div>
        </div>
      </div>

      <div className="zara-table-wrapper">
        {loading ? (
          <div className="zara-loading">
            <div className="zara-spinner"></div>
            <span>Loading requests...</span>
          </div>
        ) : (
          <table className="zara-table">
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
                  <td>{new Date(request.requestDate).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}</td>
                  <td>
                    <span className={`zara-status ${request.status || 'pending'}`}>
                      {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'Pending'}
                    </span>
                  </td>
                  <td className="zara-actions">
                    <button
                      onClick={() => handleStatusChange(request._id, 'approved')}
                      className={`zara-btn zara-approve ${request.status === 'approved' ? 'disabled' : ''}`}
                      disabled={request.status === 'approved' || buttonLoading[request._id] === 'approved'}
                      title="Approve"
                    >
                      {buttonLoading[request._id] === 'approved' ? (
                        <span className="spinner-small"></span>
                      ) : '✓'}
                    </button>

                    <button
                      onClick={() => handleStatusChange(request._id, 'rejected')}
                      className={`zara-btn zara-reject ${request.status === 'rejected' ? 'disabled' : ''}`}
                      disabled={request.status === 'rejected' || buttonLoading[request._id] === 'rejected'}
                      title="Reject"
                    >
                      {buttonLoading[request._id] === 'rejected' ? (
                        <span className="spinner-small"></span>
                      ) : '✕'}
                    </button>

                    <button
                      onClick={() => downloadPdf(request._id)}
                      className="zara-btn zara-download"
                      title="Download"
                    >
                      ↓
                    </button>

                    <button
                      onClick={() => handleDelete(request._id)}
                      className="zara-btn zara-delete"
                      title="Delete"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="zara-pagination">
        <div className="zara-pagination-info">
          Showing {requests.length} of {pagination.totalItems} entries
        </div>
        <div className="zara-pagination-controls">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="zara-pagination-btn"
          >
            Previous
          </button>
          <span className="zara-page-info">
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

      <style>{`
        .spinner-small {
          width: 14px;
          height: 14px;
          border: 2px solid white;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminIdRequests;
