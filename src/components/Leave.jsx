import { useState } from "react";
import axios from "axios";
import DarkFormWrapper from "../Others/DarkFormWrapper";
import FormGroup from "../Others/FormGroup";
import FileUpload from "../Others/FileUpload";
import SubmitButton from "../Others/SubmitButton";
import "../styles/Forms.css";
import { useToast } from '../context/ToastContext';

function Leave() {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    college: "",
    branch: "",
    semester: "",
    reason: "",
    email: "",
    receipt: null,
    startDate: "",
    endDate: "",
  });

  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, receipt: file }));
    setFileName(file ? file.name : "");
  };

  const handleClearFile = () => {
    setFormData(prev => ({ ...prev, receipt: null }));
    setFileName("");
  };

  const validateForm = () => {
    const requiredFields = [
      'name', 'rollNumber', 'college', 'branch', 'semester',
      'reason', 'email', 'startDate', 'endDate'
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        addToast(
          {
            title: 'Info',
            body: `Please Fill In The ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} Field !`
          },
          'info'
        );
        return false;
      }
    }

    if (!formData.receipt) {
      addToast(
        {
          title: 'Info',
          body: "Upload Receipt !"
        },
        'info'
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/submit-leave`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      addToast(
        { title: 'Success', body: 'Submitted Successfully!' },
        'success'
      );
    } catch (error) {
      console.error("Error Submitting Form:", error);
      addToast(
        { title: 'Error', body: 'Failed To Submit !' },
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DarkFormWrapper title="Leave Request Form">
      <FormGroup label="Name">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name - At Most 14 Characters"
          maxLength={14}
          required
        />
      </FormGroup>

      <FormGroup label="Roll Number">
        <input
          type="text"
          name="rollNumber"
          value={formData.rollNumber}
          onChange={handleChange}
          placeholder="Roll.No - Capital Letters & Numbers Only"
          required
        />
      </FormGroup>

      <FormGroup label="College">
        <input
          type="text"
          name="college"
          value={formData.college}
          onChange={handleChange}
          placeholder="Enter your college name"
          required
        />
      </FormGroup>

      <FormGroup label="Branch">
        <input
          type="text"
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          placeholder="Enter your branch"
          required
        />
      </FormGroup>

      <FormGroup label="Semester">
        <input
          type="text"
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          placeholder="Enter your semester"
          required
        />
      </FormGroup>

      <FormGroup label="Reason for Leave">
        <input
          type="text"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Enter reason for leave"
          required
        />
      </FormGroup>

      <FormGroup label="Email">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
      </FormGroup>

      <div className="date-group">
        <FormGroup label="Start Date">
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup label="End Date">
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </FormGroup>
      </div>

      <div className="file-upload-group">
        <FileUpload
          id="receipt"
          name="receipt"
          onChange={handleFileChange}
          accept="application/pdf"
          label="Upload Receipt (PDF)"
        />
        {fileName && (
          <div className="file-info">
            <span className="file-name">{fileName}</span>
            <button
              type="button"
              className="clear-file"
              onClick={handleClearFile}
              aria-label="Clear file"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <SubmitButton onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span className="spinner"></span>
            Processing...
          </>
        ) : (
          "Submit"
        )}
      </SubmitButton>
    </DarkFormWrapper>
  );
}

export default Leave;