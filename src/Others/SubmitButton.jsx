import "../styles/Forms.css";

const SubmitButton = ({ onClick, children }) => {
  return (
    <button type="submit" className="dark-submit-button" onClick={onClick}>
      {children}
    </button>
  );
};

export default SubmitButton;