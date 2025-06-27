import { useState, useEffect } from "react";
import "../styles/LeaveTable.css";
import { useToast } from '../context/ToastContext';

function LeaveTable() {
    const { addToast } = useToast();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [rejectingId, setRejectingId] = useState(null);
    const [approvingId, setApprovingId] = useState(null);
    const [rejectLoadingId, setRejectLoadingId] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/applications3`);
            if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
            const result = await response.json();

            const applications = Array.isArray(result) ? result :
                (Array.isArray(result.applications) ? result.applications : []);

            setApplications(applications);
        } catch (error) {
            console.error("Error Fetching Applications:", error);
            addToast({ title: 'Error', body: "Failed To Fetch !" }, 'error');
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredApplications = applications.filter(app => {
        if (!app) return false;
        const searchLower = searchTerm.toLowerCase();
        return (
            (app.name?.toLowerCase().includes(searchLower)) ||
            (app.rollNumber?.toLowerCase().includes(searchLower)) ||
            (app.college?.toLowerCase().includes(searchLower)) ||
            (app.reason?.toLowerCase().includes(searchLower)) ||
            (app.status?.toLowerCase().includes(searchLower))
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

    const handleApprove = async (id) => {
        setApprovingId(id);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/approve-application3`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) throw new Error("Failed To Approve Application !");

            addToast({ title: 'Success', body: "Application Approved Successfully!" }, 'success');
            await fetchApplications();
        } catch (error) {
            console.error("Approval Error:", error);
            addToast({ title: 'Error', body: 'Failed to approve application!' }, 'error');
        } finally {
            setApprovingId(null);
        }
    };

    const handleReject = async (id) => {
        setRejectLoadingId(id);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reject-application3`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) throw new Error("Failed To Reject Application !");

            addToast({ title: 'Success', body: "Application Rejected Successfully!" }, 'success');
            await fetchApplications();
        } catch (error) {
            console.error("Rejection Error:", error);
            addToast({ title: 'Error', body: 'Failed to reject application!' }, 'error');
        } finally {
            setRejectLoadingId(null);
            setRejectingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are You Sure You Want To Delete This Application?")) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/delete-application3/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                addToast({ title: 'Success', body: 'Application Deleted Successfully!' }, 'success');
                await fetchApplications();
            } else {
                throw new Error("Failed to delete application");
            }
        } catch (error) {
            console.error("Error Deleting Application:", error);
            addToast({ title: 'Error', body: "Failed to delete application!" }, 'error');
        }
    };

    const handleDownload = (filePath, fileName) => {
        if (filePath) {
            const cleanPath = filePath.replace(/\\/g, '/').replace(/^\/?/, '/');
            const fullUrl = `${import.meta.env.VITE_API_URL}${cleanPath}`;
            window.open(fullUrl, "_blank");
        } else {
            addToast({ title: 'Error', body: 'No File To Download!' }, 'error');
        }
    };

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    return (
        <div className="admin-container">
            <div className="admin-content">
                <h1 className="admin-heading">Leave Requests</h1>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by name, rollNumber, reason, college etc..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="table-controls">
                    <div className="items-per-page">
                        <label>Show:</label>
                        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                            {[5, 10, 20, 50].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                        <span>entries</span>
                    </div>

                    {filteredApplications.length > itemsPerPage && (
                        <div className="pagination">
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                            <div className="page-numbers">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                    <button
                                        key={number}
                                        onClick={() => handlePageChange(number)}
                                        className={currentPage === number ? 'active' : ''}
                                    >
                                        {number}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="loading-spinner">Loading Requests...</div>
                ) : applications.length === 0 ? (
                    <div className="no-applications">No requests found</div>
                ) : (
                    <div className="applications-table-container">
                        <table className="applications-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Roll No.</th>
                                    <th>College</th>
                                    <th>Reason</th>
                                    <th className="date-col">Dates</th>
                                    <th>Status</th>
                                    <th>Approve</th>
                                    <th>Reject</th>
                                    <th>Del</th>
                                    <th>PDF</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((app) => (
                                    <tr key={app._id}>
                                        <td>{app.name || '-'}</td>
                                        <td>{app.rollNumber || '-'}</td>
                                        <td>{app.college || '-'}</td>
                                        <td>{app.reason || '-'}</td>
                                        <td>
                                            {app.startDate ? new Date(app.startDate).toLocaleDateString() : '-'} -{' '}
                                            {app.endDate ? new Date(app.endDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${app.status?.toLowerCase() || 'pending'}`}>
                                                {app.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td>
                                            {app.status?.toLowerCase() !== "approved" && (
                                                <button
                                                    className="action-btn approve-btn"
                                                    onClick={() => handleApprove(app._id)}
                                                    disabled={approvingId === app._id}
                                                >
                                                    {approvingId === app._id ? (
                                                        <span className="spinner"></span>
                                                    ) : "Approve"}
                                                </button>
                                            )}
                                        </td>
                                        <td>
                                            {app.status?.toLowerCase() !== "rejected" && (
                                                <button
                                                    className="action-btn reject-btn"
                                                    onClick={() => handleReject(app._id)}
                                                    disabled={rejectLoadingId === app._id}
                                                >
                                                    {rejectLoadingId === app._id ? (
                                                        <span className="spinner"></span>
                                                    ) : "Reject"}
                                                </button>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="action-btn delete-btn"
                                                onClick={() => handleDelete(app._id)}
                                            >
                                                Del
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="action-btn download-btn"
                                                onClick={() => handleDownload(app.receiptPath, `${app.name || 'application'}_leave_receipt.pdf`)}
                                                disabled={!app.receiptPath}
                                            >
                                                Dow
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

export default LeaveTable;