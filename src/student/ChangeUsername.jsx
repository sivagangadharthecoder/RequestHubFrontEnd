import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContent } from '../context/AppContext'
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const ChangeUsername = () => {
    const { addToast } = useToast();

    const { backendUrl } = useContext(AppContent);
    axios.defaults.withCredentials = true;
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

    const inputRefs = React.useRef([]);

    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text');
        const pasteArray = paste.split('');
        pasteArray.forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char;
            }
        });
    };

    const onSubmitEmail = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp2`, { email });
            if (data.success) {
                addToast(
                    { title: 'Success', body: 'OTP Sent !' },
                    'success'
                );
                setIsEmailSent(true);
            } else {
                addToast(
                    { title: 'Error', body: 'Failed To Send OTP !' },
                    'error'
                );
            }
        } catch (error) {
            addToast(
                { title: 'Error', body: 'Failed To Send OTP !' },
                'error'
            );
        }
    };

    const onSubmitOTP = async (e) => {
        e.preventDefault();
        const otpArray = inputRefs.current.map(e => e.value);
        setOtp(otpArray.join(''));
        setIsOtpSubmitted(true);
    };

    const onSubmitNewUsername = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${backendUrl}/api/auth/change-username`, {
                email,
                otp,
                newUsername
            });
            if (data.success) {
                addToast(
                    { title: 'Success', body: 'Changing Username Success !' },
                    'success'
                );
                navigate('/student-dashboard');
                ;
            } else {
                addToast(
                    { title: 'Error', body: 'Changing Username Failed !' },
                    'error'
                );
            }
        } catch (error) {
            addToast(
                { title: 'Error', body: 'Changing Username Failed !' },
                'error'
            );
        }
    };

    return (
        <div className="reset-container">
            <Link to="/" className="logo-link">
                <h1 className="logo">RequestHub</h1>
            </Link>

            <div className="reset-card">
                {!isEmailSent && (
                    <form onSubmit={onSubmitEmail} className="reset-form">
                        <h1 className="reset-title">Change Username</h1>
                        <p className="reset-subtitle">Enter Your Registered College Mail</p>

                        <div className="reset-input-group">
                            <input
                                type="email"
                                placeholder="Mail ID"
                                value={email.toLowerCase()}
                                required
                                className="reset-input"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="reset-submit-button">Continue</button>
                    </form>
                )}

                {isEmailSent && !isOtpSubmitted && (
                    <form onSubmit={onSubmitOTP} className="reset-form">
                        <h1 className="reset-title">Enter OTP</h1>
                        <p className="reset-subtitle">Check your email for the 6-digit code</p>

                        <div className="reset-otp-container" onPaste={handlePaste}>
                            {Array(6).fill(0).map((_, index) => (
                                <input
                                    type="text"
                                    maxLength="1"
                                    key={index}
                                    required
                                    className="reset-otp-input"
                                    ref={el => inputRefs.current[index] = el}
                                    onInput={(e) => handleInput(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                />
                            ))}
                        </div>
                        <button type="submit" className="reset-submit-button">Verify</button>
                    </form>
                )}

                {isOtpSubmitted && isEmailSent && (
                    <form onSubmit={onSubmitNewUsername} className="reset-form">
                        <h1 className="reset-title">New Username</h1>
                        <p className="reset-subtitle">Create your new username</p>

                        <div className="reset-input-group">
                            <input
                                type="text"
                                placeholder="New Username"
                                value={newUsername}
                                required
                                className="reset-input"
                                onChange={(e) => setNewUsername(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="reset-submit-button">Change Username</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ChangeUsername;