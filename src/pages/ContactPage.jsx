import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner, FaCheck, FaTimes } from 'react-icons/fa';
import '../styles/ContactPage.css';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';

const ContactPage = () => {
    const { addToast } = useToast();
    const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

    const onSubmit = async (event) => {
        event.preventDefault();
        setSubmitStatus('loading');
        
        try {
            const formData = new FormData(event.target);
            formData.append("access_key", "43bbf669-6bae-4eb8-b6b0-85c2335e94d1");

            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: json
            }).then((res) => res.json());

            if (res.success) {
                setSubmitStatus('success');
                addToast(
                    { title: 'Success', body: 'Issue Sent!' },
                    'success'
                );
                event.target.reset();
                
                // Reset button state after 2 seconds
                setTimeout(() => setSubmitStatus('idle'), 2000);
            } else {
                setSubmitStatus('error');
                addToast(
                    { title: 'Error', body: 'Failed To Send Mail!' },
                    'error'
                );
                
                // Reset button state after 3 seconds
                setTimeout(() => setSubmitStatus('idle'), 3000);
            }
        } catch (error) {
            setSubmitStatus('error');
            addToast(
                { title: 'Error', body: 'Network Error! Please try again.' },
                'error'
            );
            
            // Reset button state after 3 seconds
            setTimeout(() => setSubmitStatus('idle'), 3000);
        }
    };

    const getButtonContent = () => {
        switch (submitStatus) {
            case 'loading':
                return (
                    <>
                        <FaSpinner className="spin" />
                        <span>Processing...</span>
                    </>
                );
            case 'success':
                return (
                    <>
                        <FaCheck />
                        <span>Success!</span>
                    </>
                );
            case 'error':
                return (
                    <>
                        <FaTimes />
                        <span>Error</span>
                    </>
                );
            default:
                return 'Submit Now';
        }
    };

    return (
        <>
            <Navbar />
            <div className="contact" id='contact'>
                <Link to="/" className="contact-header">
                    <h1>RequestHub</h1>
                </Link>
                <div className="contact-title">
                    <h1>Contact</h1>
                </div>
                <div className="contact-section">
                    <div className="contact-left">
                        <h1>Get In Touch</h1>
                        <p>You can contact us through..</p>
                        <div className="contact-details">
                            <div className="contact-detail">
                                <img src='call_icon.svg' alt="call" />
                                <a href="tel:7981377123">7981377123</a>
                            </div>
                            <div className="contact-detail">
                                <img src='location.svg' alt="location" />
                                <a href="https://g.co/kgs/ZtWMsRt" target="_blank" rel="noopener noreferrer">
                                    Surampalem, East Godavari Dist, Andhra Pradesh
                                </a>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={onSubmit} className="contact-right">
                        <label>Your Roll Number</label>
                        <input type="text" placeholder='Your Roll.No - Capitals' name='name' required />
                        <label>Your Mobile Number</label>
                        <input type="number" placeholder='Your Phone Number' name='phone' required />
                        <label>Your Mail</label>
                        <input type="email" placeholder='Enter Your Mail' name='email' required />
                        <label>Write Your Issue</label>
                        <textarea name="message" rows="8" placeholder='Enter Your Message' required></textarea>
                        <button 
                            type='submit' 
                            className={`contact-submit ${submitStatus}`}
                            disabled={submitStatus === 'loading'}
                        >
                            {getButtonContent()}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ContactPage;