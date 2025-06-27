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
  onTogglePassword = () => { },
  isPasswordVisible = false
}) => (
  <>
    <div style={{ position: "relative", marginBottom: "4px" }}>
      <span
        className={value ? "icon-animate" : ""}
        style={{
          position: "absolute",
          left: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "16px",
          color: "#666",
          opacity: value ? 0 : 1,
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        {icon}
      </span>
      <input
        value={value}
        onChange={onChange}
        placeholder={value ? "" : placeholder}
        required={required}
        type={type}
        className={value ? "placeholder-animate" : ""}
        style={{
          width: "100%",
          padding: value ? "12px 12px" : "12px 12px 12px 40px",
          border: error ? "1px solid #ff4444" : "1px solid #ddd",
          borderRadius: "4px",
          fontSize: "14px",
          color: "#222",
          transition: "border-color 0.2s, padding 0.3s ease",
          boxSizing: "border-box",
          paddingRight: showPasswordToggle ? "40px" : "12px"
        }}
      />
      {showPasswordToggle && (
        <span
          onClick={onTogglePassword}
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "16px",
            color: "#666",
            cursor: "pointer",
            transition: "color 0.2s ease"
          }}
        >
          {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}
    </div>
    {error && (
      <p
        style={{
          color: "#ff4444",
          fontSize: "12px",
          margin: "0 0 12px 0",
          textAlign: "right",
        }}
      >
        {error}
      </p>
    )}
  </>
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
    password: "",
    confirmPassword: "",
  });
  const [buttonState, setButtonState] = useState('default');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateName = (value) => {
    if (value.length > 14) {
      setErrors((prev) => ({
        ...prev,
        name: "Name must be 14 characters or less",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, name: "" }));
    return true;
  };

  const validateEmail = (value) => {
    const allowedDomains = ["acet.ac.in", "aec.edu.in", "acoe.edu.in"];
    const domain = value.split("@")[1];

    if (!domain || !allowedDomains.includes(domain)) {
      setErrors((prev) => ({ ...prev, email: "Invalid college email" }));
      return false;
    }

    return true;
  };

  const validateConfirmPassword = (value) => {
    if (value !== password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return false;
    }

    setErrors((prev) => ({
      ...prev,
      confirmPassword: "",
    }));
    return true;
  };

  const validateRollNumber = (value) => {
    if (value.length > 10) {
      setErrors((prev) => ({
        ...prev,
        rollNumber: "Roll number must be 10 characters or less",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, rollNumber: "" }));
    return true;
  };

  const validatePassword = (value) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasNumber = /\d/.test(value);

    if (value.length < minLength) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters long",
      }));
      return false;
    }

    if (!hasUpperCase) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must contain at least one uppercase letter",
      }));
      return false;
    }

    if (!hasSpecialChar) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must contain at least one special character",
      }));
      return false;
    }

    if (!hasNumber) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must contain at least one number",
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, password: "" }));
    return true;
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 14) {
      setName(value);
      validateName(value);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value.toLowerCase();
    setEmail(value);
    validateEmail(value);
  };

  const handleRollNumberChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (value.length <= 10) {
      setRollNumber(value);
      validateRollNumber(value);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
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

      const isNameValid = state === "Sign Up" ? validateName(name) : true;
      const isEmailValid = validateEmail(email);
      const isRollNumberValid = validateRollNumber(rollNumber);
      const isPasswordValid = validatePassword(password);
      const isConfirmPasswordValid =
        state === "Sign Up" ? validateConfirmPassword(confirmPassword) : true;

      if (
        !isNameValid ||
        !isRollNumberValid ||
        !isPasswordValid ||
        !isConfirmPasswordValid ||
        !isEmailValid
      ) {
        addToast(
          {
            title: "Form Validation Failed",
            body: "Please enter the details correct format.",
          },
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
            {
              title: "Account Creation Success!",
              body: "Welcome To RequestHub!",
            },
            "success"
          );

          addToast(
            {
              title: "Email Verification Required",
              body: "Verify Your Mail To Access Dashboard",
            },
            "info"
          );

          navigate("/");
        } else {
          setButtonState('error');
          await new Promise(resolve => setTimeout(resolve, 1500));
          setButtonState('default');

          addToast(
            {
              title: "Registration Failed",
              body:
                response.data.message ||
                "Unable To Create Account. Please Try Again.",
            },
            "error"
          );
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
            {
              title: "Login Successful",
              body: `Welcome back, ${response.data.user?.name || ""}!`,
            },
            "success"
          );

          navigate("/");
        } else {
          setButtonState('error');
          await new Promise(resolve => setTimeout(resolve, 1500));
          setButtonState('default');

          if (response.data.message?.toLowerCase().includes("not verified")) {
            addToast(
              {
                title: "Account Not Verified",
                body: "Please verify your email",
              },
              "error"
            );
          } else if (
            response.data.message?.toLowerCase().includes("invalid credentials")
          ) {
            addToast(
              {
                title: "Invalid Credentials",
                body: "The roll number, email or password you entered is incorrect.",
              },
              "error"
            );
          } else if (
            response.data.message?.toLowerCase().includes("suspended")
          ) {
            addToast(
              {
                title: "Account Suspended",
                body: "Your account has been suspended. Please contact support.",
              },
              "error"
            );
          } else {
            addToast(
              {
                title: "Login Failed",
                body:
                  response.data.message ||
                  "An error occurred during login. Please try again.",
              },
              "error"
            );
          }
        }
      }
    } catch (error) {
      setButtonState('error');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setButtonState('default');

      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = "Invalid request data. Please check your inputs.";
        } else if (error.response.status === 401) {
          errorMessage = "Authentication failed. Please check your credentials.";
        } else if (error.response.status === 403) {
          errorMessage = "Access denied. Your account may need verification.";
        } else if (error.response.status === 409) {
          // This is the conflict status for existing user
          errorMessage = "This email or roll number is already registered.";
          addToast(
            {
              title: "User Already Exists",
              body: errorMessage,
            },
            "error"
          );
          return;
        } else if (error.response.status === 429) {
          errorMessage = "Too many attempts. Please wait before trying again.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message === "Network Error") {
        errorMessage = "Network connection failed. Please check your internet.";
      }

      addToast(
        {
          title: "Error",
          body: errorMessage,
        },
        "error"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #213448, #547792, #94B4C1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        padding: "20px",
        boxSizing: "border-box",
        perspective: "1000px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes rotate3D {
            0% { transform: rotateY(0deg) translateZ(0); }
            100% { transform: rotateY(360deg) translateZ(0); }
          }
          @keyframes iconFadeScale {
            0% { opacity: 1; transform: translateY(-50%) scale(1); }
            100% { opacity: 0; transform: translateY(-50%) scale(0.8); }
          }
          @keyframes placeholderFade {
            0% { opacity: 0.5; }
            100% { opacity: 0; }
          }
          @keyframes buttonPulse {
            0% { transform: scale(1); box-shadow: 0 0 0 rgba(33, 52, 72, 0.4); }
            50% { transform: scale(1.02); box-shadow: 0 0 10px rgba(33, 52, 72, 0.6); }
            100% { transform: scale(1); box-shadow: 0 0 0 rgba(33, 52, 72, 0.4); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes checkBounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
          @keyframes errorShake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
          }
          .background-shapes {
            position: absolute;
            width: 200px;
            height: 200px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20%;
            animation: rotate3D 20s infinite linear;
            transform-style: preserve-3d;
          }
          .shape1 { top: 10%; left: 10%; }
          .shape2 { bottom: 20%; right: 15%; }
          .shape3 { top: 50%; left: 70%; }
          .icon-animate {
            animation: iconFadeScale 0.3s ease forwards;
          }
          .placeholder-animate::placeholder {
            animation: placeholderFade 0.3s ease forwards;
          }
          .button-animate:hover {
            animation: buttonPulse 0.6s ease;
          }
          .form-container {
            animation: fadeIn 0.6s ease-in-out;
          }
          .spin {
            animation: spin 1s linear infinite;
          }
          .status-success {
            animation: checkBounce 0.6s ease;
          }
          .status-error {
            animation: errorShake 0.6s ease;
          }
        `}
      </style>

      <div className="background-shapes shape1"></div>
      <div className="background-shapes shape2"></div>
      <div className="background-shapes shape3"></div>

      <header
        style={{
          padding: "20px",
          fontSize: "24px",
          fontWeight: "700",
          color: "#fff",
          cursor: "pointer",
          textAlign: "center",
          backgroundColor: "transparent",
          textShadow: "0 1px 2px rgba(0, 0, 0, 0.4)",
          zIndex: 10,
        }}
        onClick={() => navigate("/")}
      >
        RequestHub
      </header>

      <div
        className="form-container"
        style={{
          maxWidth: "420px",
          width: "100%",
          background: "white",
          borderRadius: "12px",
          boxShadow:
            "0 30px 80px rgba(0, 0, 0, 0.3), 0 15px 30px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.5)",
          overflow: "hidden",
          border: "1px solid #e0e0e0",
          marginTop: "30px",
          transform: "rotateY(5deg) rotateX(5deg)",
          transition: "transform 0.3s ease",
          zIndex: 10,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "rotateY(0deg) rotateX(0deg)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "rotateY(5deg) rotateX(5deg)")
        }
      >
        <div style={{ padding: "24px", borderBottom: "1px solid #eee" }}>
          <h2
            style={{
              margin: "0",
              fontSize: "20px",
              color: "#222",
              fontWeight: "600",
            }}
          >
            {state === "Sign Up" ? "Create Account" : "Welcome Back"}
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: "14px", color: "#666" }}>
            {state === "Sign Up"
              ? "Get started with your account"
              : "Log in to continue"}
          </p>
        </div>

        <form onSubmit={onSubmitHandler} style={{ padding: "24px" }}>
          {state === "Sign Up" && (
            <FormInput
              icon={<FaUser />}
              value={name}
              onChange={handleNameChange}
              placeholder="Full Name - At Most 14"
              error={errors.name}
              required
            />
          )}
          <FormInput
            icon={<FaIdCard />}
            value={rollNumber}
            onChange={handleRollNumberChange}
            placeholder="Roll.No - Capitals Only"
            error={errors.rollNumber}
            required
          />
          <FormInput
            icon={<FaEnvelope />}
            value={email}
            onChange={handleEmailChange}
            placeholder="College Mail"
            type="email"
            required
          />
          <FormInput
            icon={<FaLock />}
            value={password}
            onChange={handlePasswordChange}
            placeholder={state === "Sign Up" ? "Set Password" : "Password"}
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
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                color: "#555",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => navigate("/reset-password")}
            >
              Forgot Password?
            </span>
          </div>

          <button
            type="submit"
            className="button-animate"
            disabled={buttonState === 'loading' || buttonState === 'success'}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: buttonState === 'error' ? '#F44336' :
                buttonState === 'success' ? '#4CAF50' :
                  buttonState === 'loading' ? '#cccccc' : '#213448',
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: buttonState === 'loading' || buttonState === 'success' ? 'not-allowed' : 'pointer',
              transition: "all 0.3s ease",
              marginTop: "8px",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              overflow: "hidden",
            }}
          >
            {buttonState === 'loading' ? (
              <>
                <FaSpinner className="spin" style={{ marginRight: "8px", fontSize: "18px" }} />
                Processing...
              </>
            ) : buttonState === 'success' ? (
              <>
                <FaCheck className="status-success" style={{ marginRight: "8px", fontSize: "18px" }} />
                Success!
              </>
            ) : buttonState === 'error' ? (
              <>
                <FaTimes className="status-error" style={{ marginRight: "8px", fontSize: "18px" }} />
                Try Again
              </>
            ) : (
              state
            )}
          </button>
        </form>

        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #eee",
            textAlign: "center",
            fontSize: "14px",
            color: "#666",
          }}
        >
          {state === "Sign Up" ? (
            <p>
              Already Have An Account?{" "}
              <span
                style={{
                  color: "#213448",
                  fontWeight: "500",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => setState("Login")}
              >
                Log In
              </span>
            </p>
          ) : (
            <p>
              Don't Have An Account?{" "}
              <span
                style={{
                  color: "#213448",
                  fontWeight: "500",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => setState("Sign Up")}
              >
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