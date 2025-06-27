import "../styles/Forms.css";

const FileUpload = ({ id, name, onChange, accept, label }) => {
  return (
    <div className="file-upload-group">
      <label htmlFor={id} className="file-upload-label">
        <span>{label}</span>
        <input
          type="file"
          id={id}
          name={name}
          onChange={onChange}
          accept={accept}
          required
        />
        <div className="upload-indicator">Upload</div>
      </label>
    </div>
  );
};

export default FileUpload;