import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
    if (activeMenu === menu) {
      setActiveSubmenu(null);
    }
  };

  const toggleSubmenu = (submenu) => {
    setActiveSubmenu(activeSubmenu === submenu ? null : submenu);
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <ul className="dashboard-menu">
              <button
                className="dashboard-menu-item profile-btn"
                onClick={() => {
                  setActiveMenu(null);
                  setActiveSubmenu(null);
                  navigate('profile');
                }}
              >
                <span className='profilestyling'>Profile</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>

              <li className={`dashboard-menu-item ${activeMenu === 'forms' ? 'active' : ''}`}>
                <div
                  className="dashboard-menu-header"
                  onClick={() => toggleMenu('forms')}
                >
                  <span>Forms</span>
                  <svg className={`menu-arrow ${activeMenu === 'forms' ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                {activeMenu === 'forms' && (
                  <ul className="dashboard-submenu">
                    <li><Link to="internship-form" onClick={() => setActiveSubmenu(null)}>Internship</Link></li>
                    <li><Link to="id-form" onClick={() => setActiveSubmenu(null)}>ID</Link></li>
                    <li><Link to="leave-form" onClick={() => setActiveSubmenu(null)}>Leave</Link></li>
                    <li><Link to="hackathon-form" onClick={() => setActiveSubmenu(null)}>Hackathon</Link></li>
                  </ul>
                )}
              </li>

              <li className={`dashboard-menu-item ${activeMenu === 'all-forms' ? 'active' : ''}`}>
                <div
                  className="dashboard-menu-header"
                  onClick={() => toggleMenu('all-forms')}
                >
                  <span>Submitted Forms</span>
                  <svg className={`menu-arrow ${activeMenu === 'all-forms' ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                {activeMenu === 'all-forms' && (
                  <ul className="dashboard-submenu">
                    <li><Link to="internship-table-user" onClick={() => setActiveSubmenu(null)}>Internship</Link></li>
                    <li><Link to="id-table-user" onClick={() => setActiveSubmenu(null)}>ID</Link></li>
                    <li><Link to="leave-table-user" onClick={() => setActiveSubmenu(null)}>Leave</Link></li>
                    <li><Link to="hackathon-table-user" onClick={() => setActiveSubmenu(null)}>Hackathon</Link></li>
                  </ul>
                )}
              </li>

              <li className={`dashboard-menu-item ${activeMenu === 'forms-status' ? 'active' : ''}`}>
                <div
                  className="dashboard-menu-header"
                  onClick={() => toggleMenu('forms-status')}
                >
                  <span>Forms Status</span>
                  <svg className={`menu-arrow ${activeMenu === 'forms-status' ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                {activeMenu === 'forms-status' && (
                  <ul className="dashboard-submenu">
                    <li className="nested-menu-item">
                      <div
                        className="submenu-header"
                        onClick={() => toggleSubmenu('internship')}
                      >
                        Internship
                        <svg className={`menu-arrow ${activeSubmenu === 'internship' ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                      {activeSubmenu === 'internship' && (
                        <ul className="dashboard-nested-submenu">
                          <li><Link to="internship-table-user-approved">Approved</Link></li>
                          <li><Link to="internship-table-user-rejected">Rejected</Link></li>
                          <li><Link to="internship-table-user-pending">Pending</Link></li>
                        </ul>
                      )}
                    </li>

                    <li className="nested-menu-item">
                      <div
                        className="submenu-header"
                        onClick={() => toggleSubmenu('id')}
                      >
                        ID
                        <svg className={`menu-arrow ${activeSubmenu === 'id' ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                      {activeSubmenu === 'id' && (
                        <ul className="dashboard-nested-submenu">
                          <li><Link to="id-table-user-approved">Approved</Link></li>
                          <li><Link to="id-table-user-rejected">Rejected</Link></li>
                          <li><Link to="id-table-user-pending">Pending</Link></li>
                        </ul>
                      )}
                    </li>

                    <li className="nested-menu-item">
                      <div
                        className="submenu-header"
                        onClick={() => toggleSubmenu('leave')}
                      >
                        Leave
                        <svg className={`menu-arrow ${activeSubmenu === 'leave' ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                      {activeSubmenu === 'leave' && (
                        <ul className="dashboard-nested-submenu">
                          <li><Link to="leave-table-user-approved">Approved</Link></li>
                          <li><Link to="leave-table-user-rejected">Rejected</Link></li>
                          <li><Link to="leave-table-user-pending">Pending</Link></li>
                        </ul>
                      )}
                    </li>

                    <li className="nested-menu-item">
                      <div
                        className="submenu-header"
                        onClick={() => toggleSubmenu('hackathon')}
                      >
                        Hackathon
                        <svg className={`menu-arrow ${activeSubmenu === 'hackathon' ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                      {activeSubmenu === 'hackathon' && (
                        <ul className="dashboard-nested-submenu">
                          <li><Link to="hackathon-table-user-approved">Approved</Link></li>
                          <li><Link to="hackathon-table-user-rejected">Rejected</Link></li>
                          <li><Link to="hackathon-table-user-pending">Pending</Link></li>
                        </ul>
                      )}
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </nav>
        </div>

        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;