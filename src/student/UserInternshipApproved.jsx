import React, { useState, useEffect, useContext } from "react";
import "../styles/InternshipTable.css";
import { AppContent } from "../context/AppContext";
import { useToast } from '../context/ToastContext';


function UserInternshipApproved() {
    const { addToast } = useToast();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const { userData } = useContext(AppContent)

    useEffect(() => {
        if (userData) {
            fetchApplications();
        }
    }, [userData]);

    const fetchApplications = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/applicationsApproved`);
            const data = await response.json();

            const filteredApplications = data.filter(app => app.rollNumber === userData.rollNumber);

            setApplications(filteredApplications);
            setLoading(false);
        } catch (error) {
            console.error("Error Fetching Applications:", error);
            addToast(
                {
                    title: 'Error',
                    body: "Failed To Fetch !"
                },
                'error'
            );
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


    const handleDelete = async (id) => {
        if (!window.confirm("Are You Sure ?")) {
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/delete-application/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                addToast(
                    { title: 'Success', body: 'Application Deletion Success !' },
                    'success'
                );
                fetchApplications();
            } else {
                addToast(
                    { title: 'Error', body: 'Application Deletion Failed !' },
                    'error'
                );
            }
        } catch (error) {
            console.error("Error Deleting Application:", error);
            addToast(
                { title: 'Error', body: 'Application Deletion Failed !' },
                'error'
            );
        }
    };

    const handleDownload = (filePath, fileName) => {
        if (filePath && filePath.endsWith(".pdf")) {
            window.open(`${import.meta.env.VITE_API_URL}/${filePath}`, "_blank");
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
                <h1 className="admin-heading">Approved Internship</h1>

                {/* Search Bar */}
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
                    {/* Items per page selector */}
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

                    {/* Pagination */}
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

export default UserInternshipApproved;