import { useState } from 'react';
import { AppProvider, useApp } from './AppContext';
import Login from './components/Login';
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
  entry:     'Add Entry',
  profile:   'My Performance',
};

// First page per role
const FIRST_PAGE = { admin: 'dashboard', incharge: 'dashboard', user: 'profile' };

function AppInner() {
  const { toast } = useApp();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showApiConfig, setShowApiConfig] = useState(false);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentPage(FIRST_PAGE[user.access] || 'profile');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'videos':    return <VideoLog />;
      case 'entry':     return <EntryForm currentUser={currentUser} />;
      case 'reports':   return <Reports />;
      case 'users':     return <UserManagement />;
      case 'profile':   return <MyProfile currentUser={currentUser} />;
      default:          return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Sidebar
        currentUser={currentUser}
        currentPage={currentPage}
        navigate={setCurrentPage}
        onLogout={handleLogout}
      />

      <div className="main">
        <div className="topbar">
          <div className="topbar-title">{PAGE_TITLES[currentPage] || 'Dashboard'}</div>
          <div className="topbar-right">
            <div style={{ display:'flex', alignItems:'center', gap: 5, fontSize: 11, color:'var(--text3)' }}>
              <span className="live-dot" /> Views Live
            </div>
            <div style={{ fontSize: 11, color:'var(--text3)', fontWeight: 500 }}>
              {new Date().toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' })}
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => setShowApiConfig(true)}>
              ⚙ API Config
            </button>
          </div>
        </div>

        {renderPage()}
      </div>

      {showApiConfig && <ApiConfig onClose={() => setShowApiConfig(false)} />}

      {toast && (
        <div className="toast" style={{ borderLeftColor: toast.type === 'error' ? 'var(--red)' : toast.type === 'warn' ? 'var(--amber)' : 'var(--gold2)' }}>
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
