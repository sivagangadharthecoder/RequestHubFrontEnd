import { FaUsers, FaEnvelope, FaPhone, FaUniversity, FaInstagram, FaFacebookF, FaYoutube, FaTwitter, FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
    const students = [
        {
            id: 1,
            name: 'Ravipati JayaSurya',
            email: '23a95a1210@aec.edu.in',
            role: 'Backend Developer'
        },
        {
            id: 2,
            name: 'Pabolu Sudheer',
            email: "sudheerpabolu825@gmail.com",
            role: 'Backend Developer'
        },
        {
            id: 3,
            name: 'Meena',
            email: '22A91A4457@aec.edu.in',
            role: 'Frontend Developer'
        },
        {
            id: 4,
            name: 'Navya',
            email: '22A91A4459@aec.edu.in',
            role: 'Frontend Developer'
        },
        {
            id: 5,
            name: 'Joshna',
            email: '22A91A05H6@aec.edu.in',
            role: 'Frontend Developer'
        },
        {
            id: 6,
            name: 'Siva Gangadhar',
            email: 'gsivagangadhar367@gmail.com',
            role: 'Backend Developer'
        }
    ];

    return (
        <footer className="zara-footer">
            <div className="footer-container">
                <h2 className="footer-title">Development Team</h2>
                <div className="student-grid">
                    {students.map((student) => (
                        <div className="student-card" key={student.id}>
                            <div className="student-avatar">
                                <FaUsers />
                            </div>
                            <h3>{student.name}</h3>
                            <div className="student-role">{student.role}</div>
                            <div className="student-info">
                                <p><FaEnvelope /> {student.email}</p>

                            </div>
                        </div>
                    ))}
                </div>

                <div className="social-links">
                    <a href="#" aria-label="Instagram"><FaInstagram /></a>
                    <a href="#" aria-label="Facebook"><FaFacebookF /></a>
                    <a href="#" aria-label="YouTube"><FaYoutube /></a>
                    <a href="#" aria-label="Twitter"><FaTwitter /></a>
                    <a href="#" aria-label="Location"><FaMapMarkerAlt /></a>
                    <a href="tel:+12345678900" aria-label="Phone"><FaPhone /></a>
                </div>

                <div className="copyright">
                    © {new Date().getFullYear()} RequestHub. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
