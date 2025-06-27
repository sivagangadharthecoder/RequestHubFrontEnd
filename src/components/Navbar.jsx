import { useContext, useState, useMemo } from 'react';
import '../styles/Navbar.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
    const { addToast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    const { userData, backendUrl, setUserData, setIsLoggedin, loading } = useContext(AppContent);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

    const userColor = useMemo(() => {
        const colors = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#8AC24A', '#607D8B'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }, [userData?.name]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

    const isActive = (path) => {
        // Special case for about section
        if (path === '/#servicesAbout') {
            return location.pathname === '/' && location.hash === '#servicesAbout';
        }
        return location.pathname === path ||
            (path === '/student-dashboard/profile' && location.pathname.startsWith('/student-dashboard'));
    };

    const logout = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do You Want To Logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Logout!",
            cancelButtonText: "Cancel",
            background: "#fff",
            color: "#000",
            confirmButtonColor: "#4CAF50",
            cancelButtonColor: "#F44336",
            buttonsStyling: true,
            customClass: {
                title: 'swal2-title-custom',
                content: 'swal2-content-custom',
                confirmButton: 'swal2-confirm-custom',
                cancelButton: 'swal2-cancel-custom'
            }
        });

        if (result.isConfirmed) {
            try {
                axios.defaults.withCredentials = true;
                const { data } = await axios.post(`${backendUrl}/api/auth/logout`);

                if (data.success) {
                    setIsLoggedin(false);
                    setUserData(false);
                    addToast(
                        { title: 'Success', body: 'Student Logout Success !' },
                        'success'
                    );
                    navigate("/");
                }
            } catch (error) {
                addToast(
                    {
                        title: 'Error',
                        body: "Error Occurred While Logging Out !"
                    },
                    'error'
                );
            }
        }
    };

    const sendVerificationOtp = async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/send-verify-otp`, {}, {
                withCredentials: true
            });

            if (data.success) {
                navigate('/email-verify');
                addToast(
                    { title: 'Success', body: "OTP Sent To Mail!" },
                    'success'
                );
            } else {
                addToast(
                    {
                        title: 'Error',
                        body: "Failed To Send OTP !"
                    },
                    'error'
                );
            }
        } catch (error) {
            addToast(
                {
                    title: 'Error',
                    body: "Failed To Send OTP !"
                },
                'error'
            );
        }
    };

    const handleAdminLogin = async () => {
        try {
            addToast(
                {
                    title: 'Info',
                    body: 'Login To Access Dashboard !'
                },
                'info'
            );
            navigate('/adminlogin');

            setIsAccountMenuOpen(false);
            setIsMenuOpen(false);
        } catch (error) {
            addToast(
                {
                    title: 'Error',
                    body: error.message
                },
                'error'
            );
        }
    };

    if (loading) {
        return <div className="navbar-loading">Loading...</div>;
    }

    const theStudentLogin = () => {
        addToast(
            { title: 'Info', body: 'Login or Register First !' },
            'info'
        ); navigate('/login')
    }

    return (
        <nav className="navbar">
            <div className="navbar__container">
                <h1 className="navbar__logo" onClick={() => navigate('/')}>
                    <img src="/assets/images/logo3.png" alt="Logo" className="navbar__logo-image" />
                </h1>

                <div className={`navbar__links ${isMenuOpen ? 'open' : ''}`}>
                    <Link
                        to="/#servicesAbout"
                        className={`navbar__link ${isActive('/#servicesAbout') ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <span className="navbar__link-text">ABOUT</span>
                        <div className="navbar__link-hover"></div>
                    </Link>
                    <Link
                        to="/contact"
                        className={`navbar__link ${isActive('/contact') ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <span className="navbar__link-text">CONTACT</span>
                        <div className="navbar__link-hover"></div>
                    </Link>

                    {userData?.isAccountVerified && (
                        <Link
                            to="/student-dashboard/profile"
                            className={`navbar__link ${isActive('/student-dashboard/profile') ? 'active' : ''}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <span className="navbar__link-text">DASHBOARD</span>
                            <div className="navbar__link-hover"></div>
                        </Link>
                    )}

                    {userData ? (
                        <div className={`navbar__user-wrapper ${isMenuOpen ? 'mobile-view' : ''}`}>
                            <div
                                className="navbar__user-icon"
                                onClick={toggleUserMenu}
                                style={{ backgroundColor: userColor }}
                            >
                                {userData.name[0].toUpperCase()}
                            </div>
                            {isUserMenuOpen && (
                                <div className={`navbar__user-menu ${isMenuOpen ? 'mobile-position' : ''}`}>
                                    {!userData.isAccountVerified && (
                                        <div
                                            className="navbar__user-menu-item"
                                            onClick={() => sendVerificationOtp()}
                                        >
                                            Verify Account
                                        </div>
                                    )}
                                    <div
                                        className="navbar__user-menu-item"
                                        onClick={() => logout()}
                                    >
                                        Logout
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={`navbar__account-wrapper ${isMenuOpen ? 'mobile-view' : ''}`}>
                            <div
                                className={`navbar__link ${isActive('/login') || isActive('/register') ? 'active' : ''}`}
                                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                            >
                                <span className="navbar__link-text">ACCOUNT</span>
                                <div className="navbar__link-hover"></div>
                            </div>
                            {isAccountMenuOpen && (
                                <div className={`navbar__account-menu ${isMenuOpen ? 'mobile-position' : ''}`}>
                                    <div
                                        className="navbar__account-menu-item"
                                        onClick={() => {
                                            theStudentLogin();
                                            setIsAccountMenuOpen(false);
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        User
                                    </div>
                                    <div
                                        className="navbar__account-menu-item"
                                        onClick={handleAdminLogin}
                                    >
                                        Admin
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="navbar__hamburger" onClick={toggleMenu}>
                    <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
                    <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
                    <div className={`bar ${isMenuOpen ? 'open' : ''}`}></div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;