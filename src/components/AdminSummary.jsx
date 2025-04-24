import React, { useState } from 'react';
import { FaTachometerAlt, FaUserGraduate, FaBook, FaCog, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../style/Summarycard.css';
import Students from './Students';
import Courses from './Courses';


const AdminSummary = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar toggle

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'students': return <Students />;
      case 'courses': return <Courses />;
     
      default: return <Dashboard />;
    }
  };

  const Dashboard = () => (
    <div className="dashboard-content">
      <h1>Welcome Back, Admin!</h1>
      <p>Select an option from the sidebar to get started.</p>
    </div>
  );

  // Function to handle tab change and close sidebar on mobile
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false); 
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`dashboard-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2>Student Management</h2>
        <ul>
          <li
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => handleTabChange('dashboard')}
          >
            <FaTachometerAlt /> Dashboard
          </li>
          <li
            className={activeTab === 'students' ? 'active' : ''}
            onClick={() => handleTabChange('students')}
          >
            <FaUserGraduate /> Students
          </li>
          <li
            className={activeTab === 'courses' ? 'active' : ''}
            onClick={() => handleTabChange('courses')}
          >
            <FaBook /> Courses
          </li>
        
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </li>
        </ul>
      </aside>

      <main className="main-content">
        {/* Hamburger menu to toggle sidebar */}
        <div className="hamburger" onClick={toggleSidebar}>
          <FaBars />
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminSummary;
