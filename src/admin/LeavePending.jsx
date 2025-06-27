import { useState, useEffect } from "react";
import "../styles/LeaveTable.css";
import { useToast } from '../context/ToastContext';

function LeavePending() {
    const { addToast } = useToast();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/applications3Pending`);
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
            const result = await response.json();

            const applications = Array.isArray(result) ? result :
                (Array.isArray(result.applications) ? result.applications : []);

            setApplications(applications);
        } catch (error) {
            console.error("Error Fetching Applications:", error);
            addToast(
                {
                    title: 'Error',
                    body: "Failed To Fetch !"
                },
                'error'
            );
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
        try {
            console.log('Attempting To Approve Application ID:', id);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/approve-application3`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            console.log('Approval Response Status:', response.status);
            const data = await response.json();
            console.log('Approval Response Data:', data);

            if (!response.ok) {
                throw new Error("Failed To Approve Application");
            }

            addToast(
                { title: 'Success', body: "Application Approval Success !" },
                'success'
            );
            fetchApplications();
        } catch (error) {
            console.error("Approval error:", error);
            addToast(
                {
                    title: 'Error',
                    body: 'Application Approval Failed !'
                },

            );
        }
    };


    const handleReject = async (id) => {
        try {
            console.log("Rejecting Application ID:", id);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reject-application3`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: id }),
            });

            console.log("Reject Response Status:", response.status);
            const data = await response.json();
            console.log("Reject Response Data:", data);
            if (!response.ok) {
                throw new Error("Failed To Reject Application !");
            }

            addToast(
                { title: 'Success', body: "Application Rejection Success !" },
                'success'
            );
            fetchApplications();
        } catch (error) {
            console.error("Error:", error);
            addToast(
                {
                    title: 'Error',
                    body: 'Application Rejection Failed !'
                },
                'error'
            );
        }
    };



    const handleDelete = async (id) => {
        if (!window.confirm("Are You Sure ?")) {
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/delete-application3/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                addToast(
                    { title: 'Success', body: 'Application Deletion Success !' },
                    'success'
                );
                fetchApplications();
            } else {
                const errorData = await response.json();
                addToast(
                    {
                        title: 'Error',
                        body: "Application Deletion Failed !"
                    },
                    'error'
                );
            }
        } catch (error) {
            console.error("Error deleting application:", error);
            addToast(
                {
                    title: 'Error',
                    body: "Application Deletion Failed !"
                },
                'error'
            );
        }
    };

    const handleDownload = (filePath, fileName) => {
        if (filePath) {
            const cleanPath = filePath.replace(/\\/g, '/').replace(/^\/?/, '/');
            const fullUrl = `${import.meta.env.VITE_API_URL}${cleanPath}`;
            console.log('Download URL:', fullUrl);
            window.open(fullUrl, "_blank");
        } else {
            addToast(
                { title: 'Error', body: 'No File To Download !' },
                'error'
            );
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
                <h1 className="admin-heading">Leave Pending</h1>

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
                        <select
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="items-per-page-select"
                        >
                            {[5, 10, 20, 50].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                        <span>entries</span>
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
                                        className={`pagination-button ${currentPage === number ? 'active' : ''}`}
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
                                    <th className="action-col">Approve</th>
                                    <th className="action-col">Reject</th>
                                    <th className="action-col">Del</th>
                                    <th className="action-col">PDF</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((app) => (
                                    <tr key={app._id}>
                                        <td>{app.name || '-'}</td>
                                        <td>{app.rollNumber || '-'}</td>
                                        <td>{app.college || '-'}</td>
                                        <td>{app.reason || '-'}</td>
                                        <td className="date-col">
                                            {app.startDate ? new Date(app.startDate).toLocaleDateString() : '-'} -{' '}
                                            {app.endDate ? new Date(app.endDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${app.status?.toLowerCase() || 'pending'}`}>
                                                {app.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="action-col">
                                            {app.status?.toLowerCase() !== "approved" && (
                                                <button
                                                    className="action-btn approve-btn"
                                                    onClick={() => handleApprove(app._id)}
                                                    disabled={loading}
                                                >
                                                    Approve
                                                </button>
                                            )}
                                        </td>
                                        <td className="action-col">
                                            {app.status?.toLowerCase() !== "rejected" && (
                                                <button
                                                    className="action-btn reject-btn"
                                                    onClick={() => handleReject(app._id)}
                                                    disabled={loading}
                                                >
                                                    Reject
                                                </button>
                                            )}
                                        </td>
                                        <td className="action-col">
                                            <button
                                                className="action-btn delete-btn"
                                                onClick={() => handleDelete(app._id)}
                                                disabled={loading}
                                            >
                                                Del
                                            </button>
                                        </td>
                                        <td className="action-col">
                                            <button
                                                className="action-btn download-btn"
                                                onClick={() => handleDownload(
                                                    app.receiptPath,
                                                    `${app.name || 'application'}_leave_receipt.pdf`
                                                )}
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

export default LeavePending;
