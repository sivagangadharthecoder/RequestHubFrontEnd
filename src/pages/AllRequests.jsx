import React, { useEffect, useState } from "react";
import "../styles/InternshipTable.css";
import "../styles/AllRequests2.css";
import { useToast } from "../context/ToastContext";

function AllRequests() {
  const { addToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/all-requests`);
      const data = await res.json();
      setRequests(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching all requests:", error);
      addToast({ title: "Error", body: "Failed to fetch requests!" }, "error");
      setLoading(false);
    }
  };

  const handleAction = async (id, type, action) => {
    const map = {
      internship: "application",
      leave: "leave",
      idcard: "idcard",
      hackathon: "hackathon",
    };
    let url = `/api/${action}-${map[type]}`;
    if (action === "delete") url += `/${id}`;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
        method: action === "delete" ? "DELETE" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: action !== "delete" ? JSON.stringify({ id }) : null,
      });
      const result = await res.json();
      if (res.ok && result.success !== false) {
        addToast({ title: "Success", body: `${action} successful!` }, "success");
        fetchRequests();
      } else {
        throw new Error();
      }
    } catch {
      addToast({ title: "Error", body: `${action} failed!` }, "error");
    }
  };

  const filteredRequests = requests.filter((app) => {
    const s = searchTerm.toLowerCase();
    return (
      app.name?.toLowerCase().includes(s) ||
      app.rollNumber?.toLowerCase().includes(s) ||
      app.college?.toLowerCase().includes(s) ||
      app.internshipInstitute?.toLowerCase().includes(s) ||
      app.reason?.toLowerCase().includes(s) ||
      app.status?.toLowerCase().includes(s) ||
      app.type?.toLowerCase().includes(s)
    );
  });

  const indexOfLast = currentPage * itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfLast - itemsPerPage, indexOfLast);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  return (
    <div className="admin-container">
      <div className="admin-content">
        <h1 className="admin-heading">📋 All Requests</h1>

        <input
          type="text"
          className="search-input"
          placeholder="Search by name, roll, college, status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="table-controls">
          <label>
            Show:
            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            entries
          </label>

          {filteredRequests.length > itemsPerPage && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
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
                  <th>Type</th>
                  <th>Name</th>
                  <th>Roll No.</th>
                  <th>College</th>
                  <th>Institute/Reason</th>
                  <th>Dates</th>
                  <th>Status</th>
                  <th>Approve</th>
                  <th>Reject</th>
                  <th>Delete</th>
                  <th>PDF</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((app) => (
                  <tr key={app._id}>
                    <td>{app.type}</td>
                    <td>{app.name}</td>
                    <td>{app.rollNumber}</td>
                    <td>{app.college}</td>
                    <td>{app.internshipInstitute || app.reason || "—"}</td>
                    <td>
                      {app.startDate
                        ? `${new Date(app.startDate).toLocaleDateString()} - ${new Date(app.endDate).toLocaleDateString()}`
                        : "—"}
                    </td>
                    <td><span className={`status-badge ${app.status?.toLowerCase()}`}>{app.status}</span></td>
                    <td>
                      {app.status !== "Approved" && (
                        <button onClick={() => handleAction(app._id, app.type, "approve")} className="action-btn approve-btn">Approve</button>
                      )}
                    </td>
                    <td>
                      {app.status !== "Rejected" && (
                        <button onClick={() => handleAction(app._id, app.type, "reject")} className="action-btn reject-btn">Reject</button>
                      )}
                    </td>
                    <td>
                      <button onClick={() => handleAction(app._id, app.type, "delete")} className="action-btn delete-btn">Del</button>
                    </td>
                    <td>
                      {app.offerLetterPath && app.offerLetterPath.endsWith(".pdf") ? (
                        <button
                          className="action-btn download-btn"
                          onClick={() => window.open(`${import.meta.env.VITE_API_URL}/${app.offerLetterPath}`, "_blank")}
                        >
                          Dow.
                        </button>
                      ) : (
                        "—"
                      )}
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

export default AllRequests;
