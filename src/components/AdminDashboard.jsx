import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import '../styles/AdminDashboard.css';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [expandedSections, setExpandedSections] = useState({
        allForms: true,
        formsStatus: true,
        internshipStatus: false,
        idStatus: false,
        leaveStatus: false,
        hackathonStatus: false
    });

    const toggleSection = (section) => {
        const statusKeys = ['internshipStatus', 'idStatus', 'leaveStatus', 'hackathonStatus'];

        if (statusKeys.includes(section)) {
            setExpandedSections(prev => {
                const newState = {
                    ...prev,
                    internshipStatus: false,
                    idStatus: false,
                    leaveStatus: false,
                    hackathonStatus: false,
                    [section]: !prev[section]
                };
                return newState;
            });
        } else {
            setExpandedSections(prev => ({
                ...prev,
                [section]: !prev[section]
            }));
        }
    };

    const handleAdminLogout = () => {
        Swal.fire({
            title: "Are You Sure?",
            text: "Do You Want To Logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Logout!",
            cancelButtonText: "Cancel",
            background: "#fff",
            color: "#000",
            confirmButtonColor: "green",
            cancelButtonColor: "red",
            buttonsStyling: true,
            customClass: {
                title: 'swal2-title-custom',
                content: 'swal2-content-custom',
                confirmButton: 'swal2-confirm-custom',
                cancelButton: 'swal2-cancel-custom'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                addToast(
                    { title: 'Success', body: "Admin Logout Success !" },
                    'success'
                );
                navigate('/');
            }
        });
    };

    return (
        <div className="zara-admin-container">
            <div className="zara-admin-sidebar">
                <nav className="zara-admin-nav">
                    <div className="zara-nav-section">
                        <h3 className="zara-nav-title" onClick={() => toggleSection('allForms')}>
                            All Forms {expandedSections.allForms ? '▼' : '▶'}
                        </h3>
                        {expandedSections.allForms && (
                            <ul className="zara-nav-list">
                                <li><Link to="internship-table" className="zara-nav-link">Internship</Link></li>
                                <li><Link to="id-table" className="zara-nav-link">ID</Link></li>
                                <li><Link to="leave-table" className="zara-nav-link">Leave</Link></li>
                                <li><Link to="hackathon-table" className="zara-nav-link">Hackathon</Link></li>
                            </ul>
                        )}
                    </div>

                    <div className="zara-nav-section">
                        <h3 className="zara-nav-title" onClick={() => toggleSection('formsStatus')}>
                            Forms Status {expandedSections.formsStatus ? '▼' : '▶'}
                        </h3>

                        {expandedSections.formsStatus && (
                            <>
                                <div className="zara-status-group">
                                    <h4 className="zara-status-title" onClick={() => toggleSection('internshipStatus')}>
                                        Internship {expandedSections.internshipStatus ? '▼' : '▶'}
                                    </h4>
                                    {expandedSections.internshipStatus && (
                                        <ul className="zara-status-list">
                                            <li><Link to="internship-table-approved" className="zara-status-link">Approved</Link></li>
                                            <li><Link to="internship-table-rejected" className="zara-status-link">Rejected</Link></li>
                                            <li><Link to="internship-table-pending" className="zara-status-link">Pending</Link></li>
                                        </ul>
                                    )}
                                </div>

                                <div className="zara-status-group">
                                    <h4 className="zara-status-title" onClick={() => toggleSection('idStatus')}>
                                        ID {expandedSections.idStatus ? '▼' : '▶'}
                                    </h4>
                                    {expandedSections.idStatus && (
                                        <ul className="zara-status-list">
                                            <li><Link to="id-table-approved" className="zara-status-link">Approved</Link></li>
                                            <li><Link to="id-table-rejected" className="zara-status-link">Rejected</Link></li>
                                            <li><Link to="id-table-pending" className="zara-status-link">Pending</Link></li>
                                        </ul>
                                    )}
                                </div>

                                <div className="zara-status-group">
                                    <h4 className="zara-status-title" onClick={() => toggleSection('leaveStatus')}>
                                        Leave {expandedSections.leaveStatus ? '▼' : '▶'}
                                    </h4>
                                    {expandedSections.leaveStatus && (
                                        <ul className="zara-status-list">
                                            <li><Link to="leave-table-approved" className="zara-status-link">Approved</Link></li>
                                            <li><Link to="leave-table-rejected" className="zara-status-link">Rejected</Link></li>
                                            <li><Link to="leave-table-pending" className="zara-status-link">Pending</Link></li>
                                        </ul>
                                    )}
                                </div>

                                <div className="zara-status-group">
                                    <h4 className="zara-status-title" onClick={() => toggleSection('hackathonStatus')}>
                                        Hackathon {expandedSections.hackathonStatus ? '▼' : '▶'}
                                    </h4>
                                    {expandedSections.hackathonStatus && (
                                        <ul className="zara-status-list">
                                            <li><Link to="hackathon-table-approved" className="zara-status-link">Approved</Link></li>
                                            <li><Link to="hackathon-table-rejected" className="zara-status-link">Rejected</Link></li>
                                            <li><Link to="hackathon-table-pending" className="zara-status-link">Pending</Link></li>
                                        </ul>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </nav>

                <button className="zara-logout-btn" onClick={() => navigate('/admin-overview')}>
                    Overview
                </button>

                <button className="zara-logout-btn" onClick={() => navigate('/admin-adding')}>
                    Add Admin
                </button>

                <button className="zara-logout-btn" onClick={handleAdminLogout}>
                    Logout
                </button>
            </div>

            <div className="zara-admin-content">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminDashboard;