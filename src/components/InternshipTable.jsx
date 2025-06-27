import { useState, useEffect } from "react";
import "../styles/InternshipTable.css";

function InternshipTable() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loadingAction, setLoadingAction] = useState({ id: null, type: null });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/applications`);
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error("Error Fetching Applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const searchLower = searchTerm.toLowerCase();
    return (
      app.name.toLowerCase().includes(searchLower) ||
      app.rollNumber.toLowerCase().includes(searchLower) ||
      app.college.toLowerCase().includes(searchLower) ||
      app.internshipInstitute.toLowerCase().includes(searchLower) ||
      app.status.toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  const handleApprove = async (id) => {
    setLoadingAction({ id, type: "approve" });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/approve-application`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setApplications(prev =>
          prev.map(app =>
            app._id === id ? { ...app, status: "Approved" } : app
          )
        );
      }
    } catch (error) {
      console.error("Error Approving Application:", error);
    } finally {
      setLoadingAction({ id: null, type: null });
    }
  };


  const handleReject = async (id) => {
    setLoadingAction({ id, type: "reject" });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reject-application`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setApplications(prev =>
          prev.map(app =>
            app._id === id ? { ...app, status: "Rejected" } : app
          )
        );
      }
    } catch (error) {
      console.error("Error Rejecting Application:", error);
    } finally {
      setLoadingAction({ id: null, type: null });
    }
  };


  const handleDelete = async (id) => {
    if (!window.confirm("Are You Sure ?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/delete-application/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchApplications();
      }
    } catch (error) {
      console.error("Error Deleting Application:", error);
    }
  };

  const handleDownload = (filePath, fileName) => {
    if (filePath && filePath.endsWith(".pdf")) {
      window.open(`${import.meta.env.VITE_API_URL}/${filePath}`, "_blank");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="admin-container">
      <div className="admin-content">
        <h1 className="admin-heading">Internship Applications</h1>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Roll Number, name, college..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="table-controls">
          <div className="items-per-page">
            <label className="items-per-page-label">Show:</label>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="items-per-page-select"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="items-per-page-label">entries</span>
          </div>

          {filteredApplications.length > itemsPerPage && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button prev-next"
              >
                Previous
              </button>
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={`pagination-button number ${currentPage === number ? 'active' : ''}`}
                  >
                    {number}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button prev-next"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="applications-table-container">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll No.</th>
                  <th>College</th>
                  <th>Institute</th>
                  <th className="date-col">Dates</th>
                  <th>Status</th>
                  <th className="action-col">Approve</th>
                  <th className="action-col">Reject</th>
                  <th className="action-col">Del</th>
                  <th className="action-col">PDF</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((app) => (
                  <tr key={app._id}>
                    <td>{app.name}</td>
                    <td>{app.rollNumber}</td>
                    <td>{app.college}</td>
                    <td>{app.internshipInstitute}</td>
                    <td className="date-col">
                      {new Date(app.startDate).toLocaleDateString()} -{" "}
                      {new Date(app.endDate).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`status-badge ${app.status.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="action-col">
                      {app.status !== "Approved" && (
                        <button
                          className="action-btn approve-btn"
                          onClick={() => handleApprove(app._id)}
                          disabled={loadingAction.id === app._id && loadingAction.type === "approve"}
                        >
                          {loadingAction.id === app._id && loadingAction.type === "approve" ? (
                            <span className="spinner"></span>
                          ) : (
                            "Approve"
                          )}
                        </button>
                      )}
                    </td>
                    <td className="action-col">
                      {app.status !== "Rejected" && (
                        <button
                          className="action-btn reject-btn"
                          onClick={() => handleReject(app._id)}
                          disabled={loadingAction.id === app._id && loadingAction.type === "reject"}
                        >
                          {loadingAction.id === app._id && loadingAction.type === "reject" ? (
                            <span className="spinner"></span>
                          ) : (
                            "Reject"
                          )}
                        </button>
                      )}
                    </td>
                    <td className="action-col">
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(app._id)}
                      >
                        Del
                      </button>
                    </td>
                    <td className="action-col">
                      <button
                        className="action-btn download-btn"
                        onClick={() => handleDownload(app.offerLetterPath, `${app.name}_offer_letter.pdf`)}
                      >
                        Dow.
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default InternshipTable;
