import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContent } from '../context/AppContext.jsx';
import axios from 'axios';
import '../styles/ResetPassword.css';
import { useToast } from '../context/ToastContext';
import { FaSpinner } from 'react-icons/fa';

const ResetPassword = () => {
  const { addToast } = useToast();
  const { backendUrl } = useContext(AppContent);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [buttonState, setButtonState] = useState({
    email: 'default', // 'default', 'loading', 'success', 'error'
    otp: 'default',
    password: 'default'
  });

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
      setButtonState({ ...buttonState, email: 'loading' });

      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email });
      if (data.success) {
        addToast(
          { title: 'Success', body: 'OTP Sent !' },
          'success'
        );
        setIsEmailSent(true);
        setButtonState({ ...buttonState, email: 'success' });
        setTimeout(() => setButtonState({ ...buttonState, email: 'default' }), 1000);
      } else {
        addToast(
          { title: 'Error', body: 'Failed To Send OTP !' },
          'error'
        );
        setButtonState({ ...buttonState, email: 'error' });
        setTimeout(() => setButtonState({ ...buttonState, email: 'default' }), 1500);
      }
    } catch (error) {
      addToast(
        { title: 'Error', body: 'Failed To Send OTP !' },
        'error'
      );
      setButtonState({ ...buttonState, email: 'error' });
      setTimeout(() => setButtonState({ ...buttonState, email: 'default' }), 1500);
    }
  };

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    try {
      setButtonState({ ...buttonState, otp: 'loading' });

      const otpArray = inputRefs.current.map(e => e.value);
      setOtp(otpArray.join(''));
      setIsOtpSubmitted(true);

      setButtonState({ ...buttonState, otp: 'success' });
      setTimeout(() => setButtonState({ ...buttonState, otp: 'default' }), 1000);
    } catch (error) {
      setButtonState({ ...buttonState, otp: 'error' });
      setTimeout(() => setButtonState({ ...buttonState, otp: 'default' }), 1500);
    }
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      setButtonState({ ...buttonState, password: 'loading' });

      const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email,
        otp,
        newPassword
      });

      if (data.success) {
        addToast(
          { title: 'Success', body: 'Password Reset Success !' },
          'success'
        );
        setButtonState({ ...buttonState, password: 'success' });
        setTimeout(() => navigate('/login'), 1500);
      } else {
        addToast(
          { title: 'Error', body: 'Password Reset Failed !' },
          'error'
        );
        setButtonState({ ...buttonState, password: 'error' });
        setTimeout(() => setButtonState({ ...buttonState, password: 'default' }), 1500);
      }
    } catch (error) {
      addToast(
        { title: 'Error', body: 'Password Reset Failed !' },
        'error'
      );
      setButtonState({ ...buttonState, password: 'error' });
      setTimeout(() => setButtonState({ ...buttonState, password: 'default' }), 1500);
    }
  };

  const getButtonContent = (type, defaultText) => {
    const currentState = buttonState[type];

    if (currentState === 'loading') {
      return (
        <>
          <FaSpinner className="spin" style={{ marginRight: '8px' }} />
          Processing...
        </>
      );
    }
    if (currentState === 'success') return '✓';
    if (currentState === 'error') return '✕';
    return defaultText;
  };

  const getButtonClass = (type) => {
    const currentState = buttonState[type];
    let baseClass = 'reset-submit-button';

    if (currentState === 'loading') return `${baseClass} loading`;
    if (currentState === 'success') return `${baseClass} success`;
    if (currentState === 'error') return `${baseClass} error`;
    return baseClass;
  };

  return (
    <div
      className="reset-container"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #94B4C1, #547792, #213448)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        padding: '20px',
        boxSizing: 'border-box',
        perspective: '1200px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <style>
        {`
          @keyframes float3D {
            0% { transform: translateZ(0) rotateX(0deg) rotateY(0deg); }
            50% { transform: translateZ(100px) rotateX(45deg) rotateY(45deg); }
            100% { transform: translateZ(0) rotateX(0deg) rotateY(0deg); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .cube {
            position: absolute;
            width: 100px;
            height: 100px;
            background: rgba(33, 52, 72, 0.2);
            border: 1px solid rgba(148, 180, 193, 0.3);
            transform-style: preserve-3d;
            animation: float3D 15s infinite ease-in-out;
          }
          .cube1 { top: 15%; left: 20%; }
          .cube2 { bottom: 25%; right: 25%; }
          .cube3 { top: 60%; left: 65%; }
          .spin {
            animation: spin 1s linear infinite;
          }
          .reset-submit-button.loading {
            background-color: #547792;
          }
          .reset-submit-button.success {
            background-color: #4CAF50;
          }
          .reset-submit-button.error {
            background-color: #F44336;
          }
        `}
      </style>

      <div className="cube cube1"></div>
      <div className="cube cube2"></div>
      <div className="cube cube3"></div>

      <Link
        to="/"
        className="logo-link"
        style={{
          padding: '20px',
          fontSize: '24px',
          fontWeight: '700',
          color: '#fff',
          textDecoration: 'none',
          textAlign: 'center',
          textShadow: '0 1px 2px rgba(33, 52, 72, 0.3)',
          zIndex: 10
        }}
      >
        RequestHub
      </Link>

      <div
        className="reset-card"
        style={{
          maxWidth: '420px',
          width: '100%',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 30px 80px rgba(33, 52, 72, 0.3), 0 15px 30px rgba(33, 52, 72, 0.2), inset 0 2px 4px rgba(148, 180, 193, 0.5)',
          overflow: 'hidden',
          border: '1px solid #94B4C1',
          animation: 'fadeIn 0.6s ease-in-out',
          transform: 'rotateY(3deg) rotateX(3deg)',
          transition: 'transform 0.3s ease',
          zIndex: 10
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'rotateY(0deg) rotateX(0deg)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'rotateY(3deg) rotateX(3deg)'}
      >
        {!isEmailSent && (
          <form onSubmit={onSubmitEmail} className="reset-form">
            <h1 className="reset-title" style={{ color: '#213448' }}>Reset Password</h1>
            <p className="reset-subtitle" style={{ color: '#547792' }}>Enter Your Registered Mail Address</p>

            <div className="reset-input-group">
              <input
                type="email"
                placeholder="Email ID"
                value={email}
                required
                className="reset-input"
                style={{ borderColor: '#94B4C1', color: '#213448' }}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className={getButtonClass('email')}
              style={{ color: '#94B4C1' }}
              disabled={buttonState.email === 'loading' || buttonState.email === 'success'}
            >
              {getButtonContent('email', 'Continue')}
            </button>
          </form>
        )}

        {isEmailSent && !isOtpSubmitted && (
          <form onSubmit={onSubmitOTP} className="reset-form">
            <h1 className="reset-title" style={{ color: '#213448' }}>Enter OTP</h1>
            <p className="reset-subtitle" style={{ color: '#547792' }}>Check your email for the 6-digit code</p>

            <div className="reset-otp-container" onPaste={handlePaste}>
              {Array(6).fill(0).map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="reset-otp-input"
                  style={{ borderColor: '#94B4C1', color: '#213448' }}
                  ref={el => (inputRefs.current[index] = el)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>
            <button
              type="submit"
              className={getButtonClass('otp')}
              style={{ color: '#94B4C1' }}
              disabled={buttonState.otp === 'loading' || buttonState.otp === 'success'}
            >
              {getButtonContent('otp', 'Verify')}
            </button>
          </form>
        )}

        {isOtpSubmitted && isEmailSent && (
          <form onSubmit={onSubmitNewPassword} className="reset-form">
            <h1 className="reset-title" style={{ color: '#213448' }}>New Password</h1>
            <p className="reset-subtitle" style={{ color: '#547792' }}>Create your new password</p>

            <div className="reset-input-group">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                required
                className="reset-input"
                style={{ borderColor: '#94B4C1', color: '#213448' }}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className={getButtonClass('password')}
              style={{ color: '#94B4C1' }}
              disabled={buttonState.password === 'loading' || buttonState.password === 'success'}
            >
              {getButtonContent('password', 'Reset Password')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;