import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';


const IdRejected = () => {
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
            status: 'rejected',
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
      addToast(
        { title: 'Success', body: `Request ${status} Successfully !` },
        'success'
      );
    } catch (error) {
      console.error('Error updating status:', error);
      addToast(
        { title: 'Error', body: `Request ${status} Failed !` },
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
    <div className="zara-admin-content-container">


      <div className="zara-admin-header">
        <h1 className="zara-admin-title">ID Card Rejected</h1>
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
            <span className="zara-rows-label"> </span>
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
        <div className="zara-table-container">
          {loading ? (
            <div className="zara-loading-state">
              <div className="zara-loading-spinner"></div>
              <span>Loading requests...</span>
            </div>
          ) : (
            <table className="zara-data-table">
              <thead>
                <tr>
                  <th className="zara-th">Name</th>
                  <th className="zara-th">Roll No.</th>
                  <th className="zara-th">Department</th>
                  <th className="zara-th">College</th>
                  <th className="zara-th">Reason</th>
                  <th className="zara-th">Date</th>
                  <th className="zara-th">Status</th>
                  <th className="zara-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(request => (
                  <tr key={request._id} className="zara-tr">
                    <td className="zara-td zara-name-cell">{request.studentName}</td>
                    <td className="zara-td">{request.rollNumber}</td>
                    <td className="zara-td">{request.department}</td>
                    <td className="zara-td">{request.college}</td>
                    <td className="zara-td zara-reason-cell">{request.reason}</td>
                    <td className="zara-td">{new Date(request.requestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="zara-td">
                      <span className={`zara-status-badge ${request.status || 'pending'}`}>
                        {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : 'Pending'}
                      </span>
                    </td>
                    <td className="zara-td zara-actions-cell">
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

      <style jsx>{`
                .zara-admin-content-container {
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    color: #333;
                }
                
                .zara-admin-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                
                .zara-admin-title {
                    font-size: 24px;
                    font-weight: 400;
                    margin: 0;
                    color: #222;
                }
                
                .zara-admin-controls {
                    display: flex;
                    gap: 20px;
                    align-items: center;
                    flex-wrap: wrap;
                }
                
                .zara-search-wrapper {
                    position: relative;
                    flex-grow: 1;
                    min-width: 200px;
                }
                
                .zara-search-input {
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    border-radius: 2px;
                    font-size: 14px;
                    width: 100%;
                    transition: all 0.2s;
                }
                
                .zara-search-input:focus {
                    outline: none;
                    border-color: #999;
                }
                
                .zara-rows-selector {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .zara-rows-label {
                    font-size: 14px;
                    color: #666;
                }
                
                .zara-rows-select {
                    padding: 6px;
                    border: 1px solid #ddd;
                    border-radius: 2px;
                    font-size: 14px;
                }
                
                .zara-table-wrapper {
                    width: 100%;
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                    margin-bottom: 20px;
                    border: 1px solid #e5e5e5;
                    border-radius: 2px;
                }
                
                .zara-table-container {
                    min-width: 800px;
                    width: 100%;
                }
                
                .zara-data-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 14px;
                }
                
                .zara-th {
                    padding: 16px;
                    text-align: left;
                    font-weight: 500;
                    background-color: #f9f9f9;
                    border-bottom: 1px solid #e5e5e5;
                    color: #555;
                    white-space: nowrap;
                }
                
                .zara-td {
                    padding: 16px;
                    border-bottom: 1px solid #e5e5e5;
                    vertical-align: middle;
                    white-space: nowrap;
                }
                
                .zara-tr:last-child .zara-td {
                    border-bottom: none;
                }
                
                .zara-tr:hover {
                    background-color: #fafafa;
                }
                
                .zara-name-cell {
                    font-weight: 500;
                    color: #222;
                }
                
                .zara-reason-cell {
                    max-width: 200px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .zara-status-badge {
                    display: inline-block;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 500;
                }
                
                .zara-status-badge.pending {
                    background-color: #fff3cd;
                    color: #856404;
                }
                
                .zara-status-badge.approved {
                    background-color: #d4edda;
                    color: #155724;
                }
                
                .zara-status-badge.rejected {
                    background-color: #f8d7da;
                    color: #721c24;
                }
                
                .zara-actions-cell {
                    width: 160px;
                }
                
                .zara-action-buttons {
                    display: flex;
                    gap: 8px;
                }
                
                .zara-action-btn {
                    width: 28px;
                    height: 28px;
                    border: none;
                    border-radius: 2px;
                    background: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    transition: all 0.2s;
                }
                
                .zara-action-btn:hover {
                    opacity: 0.8;
                }
                
                .zara-approve {
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }
                
                .zara-reject {
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }
                
                .zara-download {
                    color: #004085;
                    border: 1px solid #b8daff;
                }
                
                .zara-delete {
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }
                
                .zara-disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .zara-pagination {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 20px;
                    font-size: 14px;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                
                .zara-pagination-controls {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .zara-pagination-btn {
                    padding: 6px 12px;
                    border: 1px solid #ddd;
                    background-color: white;
                    border-radius: 2px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .zara-pagination-btn:hover:not(:disabled) {
                    background-color: #f5f5f5;
                }
                
                .zara-pagination-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                .zara-page-indicator {
                    color: #666;
                }
                
                .zara-loading-state {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                    gap: 12px;
                    color: #666;
                }
                
                .zara-loading-spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid #ddd;
                    border-top-color: #333;
                    border-radius: 50%;
                    animation: zara-spin 1s linear infinite;
                }
                
                @keyframes zara-spin {
                    to { transform: rotate(360deg); }
                }

                /* Responsive styles */
                @media (max-width: 600px) {
                    .zara-admin-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .zara-admin-controls {
                        width: 100%;
                    }

                    .zara-search-wrapper {
                        width: 100%;
                    }

                    .zara-pagination {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .zara-pagination-controls {
                        margin-top: 8px;
                    }
                }

                @media (max-width: 480px) {
                    .zara-admin-content-container {
                        padding: 0 16px;
                    }
                }
            `}</style>
    </div>
  );
};

export default IdRejected;