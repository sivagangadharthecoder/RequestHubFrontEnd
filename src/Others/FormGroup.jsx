import "../styles/Forms.css";

const FormGroup = ({ label, children, fullWidth = false }) => {
  return (
    <div className={`form-group ${fullWidth ? 'full-width' : ''}`}>
      {label && <label>{label}</label>}
      {children}
    </div>
  );
};

export default FormGroup;