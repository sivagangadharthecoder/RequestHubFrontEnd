import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import { FaUser, FaIdCard, FaEnvelope, FaLock, FaSpinner, FaCheck, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";

const FormInput = ({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  required,
  showPasswordToggle = false,
  onTogglePassword = () => {},
  isPasswordVisible = false
}) => (
  <div className="form-input-group">
    <div className="input-container">
      <span className={`input-icon ${value ? "icon-animate" : ""}`}>
        {icon}
      </span>
      <input
        value={value}
        onChange={onChange}
        placeholder={value ? "" : placeholder}
        required={required}
        type={type}
        className={value ? "placeholder-animate" : ""}
      />
      {showPasswordToggle && (
        <span
          onClick={onTogglePassword}
          className="password-toggle"
        >
          {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}
    </div>
    {error && <p className="input-error">{error}</p>}
  </div>
);

const Login = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    rollNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [buttonState, setButtonState] = useState('default');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateName = (value) => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, name: "Name is required" }));
      return false;
    }
    if (value.length > 14) {
      setErrors(prev => ({ ...prev, name: "Max 14 characters" }));
      return false;
    }
    setErrors(prev => ({ ...prev, name: "" }));
    return true;
  };

  const validateEmail = (value) => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, email: "Email is required" }));
      return false;
    }
    const allowedDomains = ["acet.ac.in", "aec.edu.in", "acoe.edu.in"];
    const domain = value.split("@")[1];
    if (!domain || !allowedDomains.includes(domain)) {
      setErrors(prev => ({ ...prev, email: "Use college email only" }));
      return false;
    }
    setErrors(prev => ({ ...prev, email: "" }));
    return true;
  };

  const validateRollNumber = (value) => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, rollNumber: "Roll number is required" }));
      return false;
    }
    if (value.length > 10) {
      setErrors(prev => ({ ...prev, rollNumber: "Max 10 characters" }));
      return false;
    }
    setErrors(prev => ({ ...prev, rollNumber: "" }));
    return true;
  };

  const validatePassword = (value) => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, password: "Password is required" }));
      return false;
    }
    if (value.length < 8) {
      setErrors(prev => ({ ...prev, password: "Min 8 characters" }));
      return false;
    }
    if (!/[A-Z]/.test(value)) {
      setErrors(prev => ({ ...prev, password: "Needs uppercase letter" }));
      return false;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      setErrors(prev => ({ ...prev, password: "Needs special character" }));
      return false;
    }
    if (!/\d/.test(value)) {
      setErrors(prev => ({ ...prev, password: "Needs a number" }));
      return false;
    }
    setErrors(prev => ({ ...prev, password: "" }));
    return true;
  };

  const validateConfirmPassword = (value) => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, confirmPassword: "Confirm password" }));
      return false;
    }
    if (value !== password) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords don't match" }));
      return false;
    }
    setErrors(prev => ({ ...prev, confirmPassword: "" }));
    return true;
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    validateName(value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value.toLowerCase();
    setEmail(value);
    validateEmail(value);
  };

  const handleRollNumberChange = (e) => {
    const value = e.target.value.toUpperCase();
    setRollNumber(value);
    validateRollNumber(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
    if (confirmPassword) validateConfirmPassword(confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validateConfirmPassword(value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setButtonState('loading');

      // Validate all fields
      const isNameValid = state === "Sign Up" ? validateName(name) : true;
      const isEmailValid = validateEmail(email);
      const isRollNumberValid = validateRollNumber(rollNumber);
      const isPasswordValid = validatePassword(password);
      const isConfirmPasswordValid = state === "Sign Up" ? validateConfirmPassword(confirmPassword) : true;

      if (!isNameValid || !isEmailValid || !isRollNumberValid ||
        !isPasswordValid || !isConfirmPasswordValid) {
        addToast(
          { title: "Invalid Input", body: "Please check all fields" },
          "error"
        );
        setButtonState('error');
        setTimeout(() => setButtonState('default'), 1500);
        return;
      }

      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        const response = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          rollNumber,
          email,
          password,
        });

        if (response.data.success) {
          setButtonState('success');
          await new Promise(resolve => setTimeout(resolve, 1000));
          await getUserData();
          setIsLoggedin(true);

          addToast(
            { title: "Success", body: "Registration successful!" },
            "success"
          );
          navigate("/");
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/auth/login`, {
          rollNumber,
          email,
          password,
        });

        if (response.data.success) {
          setButtonState('success');
          await new Promise(resolve => setTimeout(resolve, 1000));
          await getUserData();
          setIsLoggedin(true);

          addToast(
            { title: "Welcome Back", body: "Login successful" },
            "success"
          );
          navigate("/");
        }
      }
    } catch (error) {
      setButtonState('error');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setButtonState('default');

      let errorMessage = "An error occurred. Please try again.";

      if (error.response) {
        switch (error.response.data.message) {
          case "User already exists":
            errorMessage = "Account already exists with this email/roll number";
            break;
          case "Enter college mail only":
            errorMessage = "Please use your college email (@acet.ac.in, etc.)";
            break;
          case "Invalid credentials":
            errorMessage = "Invalid roll number, email or password";
            break;
          case "Please fill all fields":
            errorMessage = "All fields are required";
            break;
          default:
            errorMessage = error.response.data.message || errorMessage;
        }
      } else if (error.message === "Network Error") {
        errorMessage = "Network error. Please check your connection.";
      }

      addToast(
        { title: "Error", body: errorMessage },
        "error"
      );
    }
  };

  return (
    <div className="auth-page">
      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding: 20px;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        }
        
        .auth-page::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: float 15s infinite linear;
          z-index: 0;
        }
        
        .auth-page::after {
          content: '';
          position: absolute;
          bottom: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
          animation: float 20s infinite linear reverse;
          z-index: 0;
        }
        
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-5%, 5%) rotate(5deg); }
          50% { transform: translate(-10%, 0) rotate(0deg); }
          75% { transform: translate(-5%, -5%) rotate(-5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        
        .auth-header {
          padding: 20px;
          font-size: 28px;
          font-weight: 700;
          color: #2d3748;
          cursor: pointer;
          text-align: center;
          z-index: 10;
          position: relative;
          margin-bottom: 20px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }
        
        .auth-header:hover {
          transform: translateY(-2px);
          text-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .auth-container {
          max-width: 440px;
          width: 100%;
          background: white;
          border-radius: 16px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.3);
          margin-top: 20px;
          position: relative;
          z-index: 10;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.9);
        }
        
        .auth-container:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
        
        .auth-header-section {
          padding: 28px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
        }
        
        .auth-header-section h2 {
          margin: 0;
          font-size: 22px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        
        .auth-header-section p {
          margin: 8px 0 0;
          font-size: 14px;
          opacity: 0.9;
        }
        
        .auth-form {
          padding: 28px;
        }
        
        .form-input-group {
          margin-bottom: 20px;
        }
        
        .input-container {
          position: relative;
          margin-bottom: 4px;
        }
        
        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          color: #a0aec0;
          transition: all 0.3s ease;
        }
        
        .input-icon.icon-animate {
          opacity: 0;
          transform: translateY(-50%) scale(0.8);
        }
        
        .auth-form input {
          width: 100%;
          padding: 14px 20px;
          padding-left: 48px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 15px;
          color: #2d3748;
          transition: all 0.3s ease;
          box-sizing: border-box;
          background-color: #f8fafc;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03);
        }
        
        .auth-form input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background-color: white;
        }
        
        .auth-form input.placeholder-animate::placeholder {
          opacity: 0;
        }
        
        .auth-form input::placeholder {
          color: #a0aec0;
          transition: opacity 0.3s ease;
        }
        
        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          color: #a0aec0;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        
        .password-toggle:hover {
          color: #667eea;
        }
        
        .input-error {
          color: #e53e3e;
          font-size: 13px;
          margin: 4px 0 0;
          text-align: right;
        }
        
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 20px 0;
        }
        
        .forgot-password {
          font-size: 14px;
          color: #718096;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        
        .forgot-password:hover {
          color: #667eea;
          text-decoration: underline;
        }
        
        .submit-button {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 1;
        }
        
        .submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }
        
        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        
        .submit-button:hover::before {
          opacity: 1;
        }
        
        .submit-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .submit-button:disabled {
          cursor: not-allowed;
          opacity: 0.8;
          transform: none !important;
        }
        
        .auth-switch {
          padding: 20px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          text-align: center;
          font-size: 14px;
          color: #718096;
        }
        
        .auth-switch span {
          color: #667eea;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        
        .auth-switch span:hover {
          text-decoration: underline;
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .status-success {
          animation: checkBounce 0.6s ease;
        }
        
        @keyframes checkBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        .status-error {
          animation: errorShake 0.6s ease;
        }
        
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        
        @media (max-width: 480px) {
          .auth-container {
            max-width: 100%;
            margin-top: 10px;
          }
          
          .auth-header {
            font-size: 24px;
            margin-bottom: 10px;
          }
          
          .auth-header-section, .auth-form {
            padding: 20px;
          }
          
          .auth-form input {
            padding: 12px 16px;
            padding-left: 44px;
          }
        }
      `}</style>

      <header className="auth-header" onClick={() => navigate("/")}>
        RequestHub
      </header>

      <div className="auth-container">
        <div className="auth-header-section">
          <h2>{state === "Sign Up" ? "Create Account" : "Welcome Back"}</h2>
          <p>{state === "Sign Up" ? "Get started with your account" : "Log in to continue"}</p>
        </div>

        <form onSubmit={onSubmitHandler} className="auth-form">
          {state === "Sign Up" && (
            <FormInput
              icon={<FaUser />}
              value={name}
              onChange={handleNameChange}
              placeholder="Full Name"
              error={errors.name}
              required
            />
          )}
          <FormInput
            icon={<FaIdCard />}
            value={rollNumber}
            onChange={handleRollNumberChange}
            placeholder="Roll Number"
            error={errors.rollNumber}
            required
          />
          <FormInput
            icon={<FaEnvelope />}
            value={email}
            onChange={handleEmailChange}
            placeholder="College Email"
            type="email"
            error={errors.email}
            required
          />
          <FormInput
            icon={<FaLock />}
            value={password}
            onChange={handlePasswordChange}
            placeholder={state === "Sign Up" ? "Create Password" : "Password"}
            type={showPassword ? "text" : "password"}
            error={errors.password}
            required
            showPasswordToggle={true}
            onTogglePassword={togglePasswordVisibility}
            isPasswordVisible={showPassword}
          />
          {state === "Sign Up" && (
            <FormInput
              icon={<FaLock />}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              error={errors.confirmPassword}
              required
              showPasswordToggle={true}
              onTogglePassword={toggleConfirmPasswordVisibility}
              isPasswordVisible={showConfirmPassword}
            />
          )}
          <div className="form-options">
            {state === "Login" && (
              <span
                className="forgot-password"
                onClick={() => navigate("/reset-password")}
              >
                Forgot Password?
              </span>
            )}
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={buttonState === 'loading' || buttonState === 'success'}
          >
            {buttonState === 'loading' ? (
              <>
                <FaSpinner className="spin" />
                Processing...
              </>
            ) : buttonState === 'success' ? (
              <>
                <FaCheck className="status-success" />
                Success!
              </>
            ) : buttonState === 'error' ? (
              <>
                <FaTimes className="status-error" />
                Try Again
              </>
            ) : (
              state
            )}
          </button>
        </form>

        <div className="auth-switch">
          {state === "Sign Up" ? (
            <p>
              Already Have An Account?{" "}
              <span onClick={() => setState("Login")}>
                Log In
              </span>
            </p>
          ) : (
            <p>
              Don't Have An Account?{" "}
              <span onClick={() => setState("Sign Up")}>
                Sign up
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;