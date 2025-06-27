import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Forms.css";

const DarkFormWrapper = ({ title, children }) => {
  return (
    <div className="dark-form-container">
      <ToastContainer 
        closeButton={false} 
        autoClose={2000}
        toastClassName="dark-toast"
        progressClassName="dark-toast-progress"
      />
      <h1>{title}</h1>
      <form className="dark-form">
        {children}
      </form>
    </div>
  );
};

export default DarkFormWrapper;