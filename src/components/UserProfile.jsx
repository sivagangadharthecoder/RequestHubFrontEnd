import { useContext, useState, useEffect } from "react";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Avatar, Card, Typography, Spin, Input, Button, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  CheckOutlined,
  CloseOutlined
} from "@ant-design/icons";
import axios from "axios";
import "../styles/UserProfile.css";

const { Title, Text } = Typography;

const UserProfile = () => {
  const { userData, isLoggedin, loading, setUserData } = useContext(AppContent) || {};
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userData?.name || "");
  const [requestCounts, setRequestCounts] = useState({
    pending: 0,
    accepted: 0,
    rejected: 0,
    total: 0
  });
  const [countsLoading, setCountsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setEditedName(userData?.name || "");
    const fetchRequestCounts = async () => {
      if (!isLoggedin) return;
      setCountsLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/request-counts`, {
          withCredentials: true
        });
        console.log('Request counts response:', res.data);
        setRequestCounts(res.data || { pending: 0, accepted: 0, rejected: 0, total: 0 });
      } catch (err) {
        console.error('Error fetching request counts:', err.response?.data || err.message);
        message.error(`Error: ${err.response?.data?.message || err.message || 'Failed to fetch request counts'}`);
        setRequestCounts({ pending: 0, accepted: 0, rejected: 0, total: 0 });
      } finally {
        setCountsLoading(false);
      }
    };

    fetchRequestCounts();
  }, [userData, isLoggedin]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserData(prev => ({ ...prev, name: editedName }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName(userData?.name || "");
  };

  const handleNavigateToChangeUsername = () => {
    navigate('/changeusername');
  };

  if (loading) {
    return (
      <div className="profile-loading-container">
        <Spin size="large" tip="Loading profile..." />
      </div>
    );
  }

  if (!isLoggedin || !userData) {
    return (
      <div className="profile-empty-container">
        <Card className="profile-empty-card">
          <Title level={4}>No User Data Available</Title>
          <Text type="secondary">Please Log In To View Your Profile</Text>
        </Card>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <Card className="profile-card">
          <div className="profile-header">
            <Avatar
              size={64}
              icon={<UserOutlined />}
              src={userData.avatar || undefined}
              className="profile-avatar"
            />
            <div className="profile-title-container">
              {isEditing ? (
                <div className="profile-edit-container">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="profile-edit-input"
                  />
                  <Button
                    type="text"
                    icon={<CheckOutlined />}
                    onClick={handleSave}
                    className="profile-edit-button"
                  />
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={handleCancel}
                    className="profile-edit-button"
                  />
                </div>
              ) : (
                <>
                  <Title level={3} className="profile-title">
                    {userData.name || "Unnamed User"}
                  </Title>
                  <Button
                    type="primary"
                    onClick={handleNavigateToChangeUsername}
                    className="change-username-button"
                  >
                    Edit Username
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="profile-details">
            <div className="profile-detail-item">
              <MailOutlined className="profile-detail-icon" />
              <Text strong className="profile-detail-label">Email:</Text>
              <Text className="profile-detail-value">{userData.email || "N/A"}</Text>
            </div>
            <div className="profile-detail-item">
              <IdcardOutlined className="profile-detail-icon" />
              <Text strong className="profile-detail-label">User ID:</Text>
              <Text className="profile-detail-value2 profile-detail-value">{userData._id || "N/A"}</Text>
            </div>
            <div className="profile-detail-item">
              <IdcardOutlined className="profile-detail-icon" />
              <Text strong className="profile-detail-label">Roll Number:</Text>
              <Text className="profile-detail-value">{userData.rollNumber || "N/A"}</Text>
            </div>
          </div>
        </Card>
        <div className="request-counts-container">
          <Title level={4} className="request-counts-title">Request Status</Title>
          {countsLoading ? (
            <Spin tip="Loading request counts..." />
          ) : (
            <div className="request-counts">
              <Card className="count-card pending">
                <Text strong>Pending Requests</Text>
                <Title level={3} className="count-value">{requestCounts.pending}</Title>
              </Card>
              <Card className="count-card accepted">
                <Text strong>Accepted Requests</Text>
                <Title level={3} className="count-value">{requestCounts.accepted}</Title>
              </Card>
              <Card className="count-card rejected">
                <Text strong>Rejected Requests</Text>
                <Title level={3} className="count-value">{requestCounts.rejected}</Title>
              </Card>
              <Card className="count-card total">
                <Text strong>Total Submitted</Text>
                <Title level={3} className="count-value">{requestCounts.total}</Title>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;