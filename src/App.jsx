import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VideoLog from './components/VideoLog';
import EntryForm from './components/EntryForm';
import Reports from './components/Reports';
import UserManagement from './components/UserManagement';
import MyProfile from './components/MyProfile';
import ApiConfig from './components/ApiConfig';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  videos:    'Video Log',
  reports:   'Reports & Analytics',
  users:     'Team Management',
  entry:     'Daily Entry',
  profile:   'My Performance',
};

const FIRST_PAGE = { admin: 'dashboard', incharge: 'dashboard', user: 'profile' };

function AppInner() {
  const { toast } = useApp();
  const [currentRole, setCurrentRole] = useState('admin');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showApiConfig, setShowApiConfig] = useState(false);

  const navigate = (page) => setCurrentPage(page);

  // When role changes, go to first page for that role
  const handleRoleChange = (role) => {
    setCurrentRole(role);
    setCurrentPage(FIRST_PAGE[role]);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'videos':    return <VideoLog />;
      case 'entry':     return <EntryForm currentRole={currentRole} />;
      case 'reports':   return <Reports />;
      case 'users':     return <UserManagement />;
      case 'profile':   return <MyProfile currentRole={currentRole} />;
      default:          return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Sidebar
        currentRole={currentRole}
        setCurrentRole={handleRoleChange}
        currentPage={currentPage}
        navigate={navigate}
      />

      <div className="main">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-title">{PAGE_TITLES[currentPage] || 'Dashboard'}</div>
          <div className="topbar-right">
            <div style={{ display:'flex', alignItems:'center', gap: 6, fontSize: 11, color:'var(--text3)' }}>
              <span className="live-dot" /> Views Live
            </div>
            <div style={{ fontSize: 11, color:'var(--text3)', fontWeight: 500 }}>
              {new Date().toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' })}
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => setShowApiConfig(true)}>
              ⚙️ API Config
            </button>
          </div>
        </div>

        {/* Page content */}
        {renderPage()}
      </div>

      {/* API Config Modal */}
      {showApiConfig && <ApiConfig onClose={() => setShowApiConfig(false)} />}

      {/* Toast */}
      {toast && (
        <div className="toast" style={{ borderLeftColor: toast.type === 'error' ? 'var(--red)' : toast.type === 'warn' ? 'var(--amber)' : 'var(--gold)' }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
