import { useRef, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { FaUserTie, FaIdCard, FaCode, FaCalendarAlt, FaChevronRight } from 'react-icons/fa';
import '../styles/Home.css';
import Navbar from '../components/Navbar';
import { AppContent } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { useToast } from '../context/ToastContext';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const { addToast } = useToast();
    const navigate = useNavigate();
    const processNodes = useRef([]);
    const processConnectors = useRef([]);
    const { userData } = useContext(AppContent);
    const heroRef = useRef(null);
    const servicesRef = useRef(null);
    const processRef = useRef(null);
    const ctaRef = useRef(null);
    const floatingObjectsRef = useRef([]);

    useEffect(() => {
        gsap.fromTo(
            heroRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        );

        gsap.fromTo(
            servicesRef.current.children,
            { opacity: 0, y: 30, scale: 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: servicesRef.current,
                    start: 'top 80%',
                },
            }
        );

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        gsap.to(entry.target, {
                            scale: 1,
                            rotation: 0,
                            duration: 0.5,
                            ease: 'back.out(1.7)',
                        });
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
        );

        processNodes.current.forEach((node) => observer.observe(node));
        processConnectors.current.forEach((connector) => observer.observe(connector));

        gsap.fromTo(
            ctaRef.current,
            { opacity: 0, scale: 0.9 },
            {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: ctaRef.current,
                    start: 'top 90%',
                },
            }
        );

        floatingObjectsRef.current.forEach((obj, index) => {
            gsap.to(obj, {
                y: '+=20',
                x: (Math.random() - 0.5) * 20,
                rotationY: 15,
                rotationX: 10,
                duration: 2 + index * 0.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: index * 0.3,
            });

            obj.addEventListener('mousemove', (e) => {
                const rect = obj.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(obj, {
                    rotationY: x / 10,
                    rotationX: -y / 10,
                    scale: 1.1,
                    duration: 0.3,
                    ease: 'power1.out',
                });
            });

            obj.addEventListener('mouseleave', () => {
                gsap.to(obj, {
                    rotationY: 0,
                    rotationX: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: 'power3.out',
                });
            });
        });

        const handleScroll = () => {
            const scrollY = window.scrollY;
            gsap.to(heroRef.current, {
                y: scrollY * 0.3,
                duration: 0.5,
                ease: 'power1.out',
            });
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            processNodes.current.forEach((node) => observer.unobserve(node));
            processConnectors.current.forEach((connector) => observer.unobserve(connector));
            window.removeEventListener('scroll', handleScroll);
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    const addToNodesRef = (el) => {
        if (el && !processNodes.current.includes(el)) {
            processNodes.current.push(el);
            gsap.set(el, { scale: 0.8, rotation: 5 });
        }
    };

    const addToConnectorsRef = (el) => {
        if (el && !processConnectors.current.includes(el)) {
            processConnectors.current.push(el);
        }
    };

    const addToFloatingObjectsRef = (el) => {
        if (el && !floatingObjectsRef.current.includes(el)) {
            floatingObjectsRef.current.push(el);
        }
    };

    const handleLogin = () => {
        addToast({ title: 'Info', body: 'Login / Register First !' }, 'info');
        navigate('/login');
    };

    const { hash } = useLocation();

    useEffect(() => {
        if (hash === '#servicesAbout') {
            const element = document.getElementById('servicesAbout');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [hash]);

    return (
        <div className="zara-portal">
            <Navbar />
            <section className="zara-hero" ref={heroRef}>
                <div className="hero-content">
                    <h1>{userData?.name ? `Hi, ${userData.name}` : 'RequestHub'}</h1>
                    <p className="hero-subtitle">Academic Services Reimagined</p>
                    <div className="hero-line"></div>
                    <p className="hero-description">
                        Streamlined Processes For Modern Academic Needs.
                        Minimal Design, Maximum Efficiency.
                    </p>
                </div>
                <div className="floating-object object-1 circle" ref={addToFloatingObjectsRef}></div>
                <div className="floating-object object-2 square" ref={addToFloatingObjectsRef}></div>
                <div className="floating-object object-3 triangle" ref={addToFloatingObjectsRef}></div>
                <div className="floating-object object-4 circle" ref={addToFloatingObjectsRef}></div>
                <div className="floating-object object-5 square" ref={addToFloatingObjectsRef}></div>
                <div className="floating-object object-6 triangle" ref={addToFloatingObjectsRef}></div>
            </section>

            <section className="services-section" id="servicesAbout">
                <div className="section-header">
                    <h2>Academic Services</h2>
                    <p>Services We Provide</p>
                </div>
                <div className="services-grid" ref={servicesRef}>
                    <ServiceCard
                        icon={<FaUserTie />}
                        title="Internship"
                        description="Permission for internship applications"
                        color="#547792"
                    />
                    <ServiceCard
                        icon={<FaIdCard />}
                        title="ID Card"
                        description="Request new or replacement IDs"
                        color="#94B4C1"
                    />
                    <ServiceCard
                        icon={<FaCode />}
                        title="Hackathon"
                        description="Register for hackathon & competitions"
                        color="#547792"
                    />
                    <ServiceCard
                        icon={<FaCalendarAlt />}
                        title="Leave"
                        description="Apply for academic leave"
                        color="#94B4C1"
                    />
                </div>
            </section>

            <section className="process-section">
                <div className="section-header">
                    <h2>How It Works</h2>
                    <p>Simple Steps To Get What You Need</p>
                </div>
                <div className="process-map-container">
                    <div className="process-map" ref={processRef}>
                        <div className="process-node first" ref={addToNodesRef}>
                            <div className="node-circle">1</div>
                            <div className="node-content">
                                <h4>Authenticate</h4>
                                <p>Register/Login With Your Credentials</p>
                            </div>
                        </div>
                        <div className="process-connector" ref={addToConnectorsRef}>
                            <div className="connector-line"></div>
                            <div className="connector-arrow"></div>
                        </div>
                        <div className="process-node" ref={addToNodesRef}>
                            <div className="node-circle">2</div>
                            <div className="node-content">
                                <h4>Verify Email</h4>
                                <p>Enter OTP Sent To Your Mail</p>
                            </div>
                        </div>
                        <div className="process-connector" ref={addToConnectorsRef}>
                            <div className="connector-line"></div>
                            <div className="connector-arrow"></div>
                        </div>
                        <div className="process-node" ref={addToNodesRef}>
                            <div className="node-circle">3</div>
                            <div className="node-content">
                                <h4>Select Service</h4>
                                <p>Choose From Our Service Offerings</p>
                            </div>
                        </div>
                        <div className="process-connector" ref={addToConnectorsRef}>
                            <div className="connector-line"></div>
                            <div className="connector-arrow"></div>
                        </div>
                        <div className="process-node" ref={addToNodesRef}>
                            <div className="node-circle">4</div>
                            <div className="node-content">
                                <h4>Complete Form</h4>
                                <p>Fill In The Required Details</p>
                            </div>
                        </div>
                        <div className="process-connector" ref={addToConnectorsRef}>
                            <div className="connector-line"></div>
                            <div className="connector-arrow"></div>
                        </div>
                        <div className="process-node last" ref={addToNodesRef}>
                            <div className="node-circle">5</div>
                            <div className="node-content">
                                <h4>Submit & Track</h4>
                                <p>Send Request & Monitor Progress</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta-section" ref={ctaRef}>
                <div className="cta-content">
                    {userData ? (
                        <>
                            <h3>Welcome Back, {userData.name}!</h3>
                            <p>Access Your Dashboard To Manage Your Requests!</p>
                        </>
                    ) : (
                        <>
                            <h3>Ready To Begin?</h3>
                            <p>Access The Portal With Your Credentials</p>
                            <button className="zara-button" onClick={handleLogin}>
                                Login <FaChevronRight className="button-icon" />
                            </button>
                        </>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
};

const ServiceCard = ({ icon, title, description, color }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(card, {
                rotationY: x / 20,
                rotationX: -y / 20,
                duration: 0.3,
                ease: 'power1.out',
            });
        };

        const handleMouseLeave = () => {
            gsap.to(card, {
                rotationY: 0,
                rotationX: 0,
                duration: 0.5,
                ease: 'power3.out',
            });
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div className="service-card" style={{ '--hover-color': color }} ref={cardRef}>
            <div className="card-icon" style={{ color }}>
                {icon}
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="card-hover-indicator"></div>
        </div>
    );
};

export default Home;
   