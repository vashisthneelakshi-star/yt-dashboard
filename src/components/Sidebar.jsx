const NAV = {
  admin: [
    { id: 'dashboard', icon: '▦',  label: 'Dashboard' },
    { id: 'videos',    icon: '▶',  label: 'Video Log' },
    { id: 'reports',   icon: '↑',  label: 'Reports' },
    { id: 'users',     icon: '◉',  label: 'Team & Users' },
    { id: 'entry',     icon: '+',  label: 'Add Entry' },
  ],
  incharge: [
    { id: 'dashboard', icon: '▦',  label: 'Dashboard' },
    { id: 'videos',    icon: '▶',  label: 'Video Log' },
    { id: 'reports',   icon: '↑',  label: 'Reports' },
    { id: 'entry',     icon: '+',  label: 'Add Entry' },
  ],
  user: [
    { id: 'profile',   icon: '◉',  label: 'My Performance' },
    { id: 'entry',     icon: '+',  label: 'Add Entry' },
  ],
};

export default function Sidebar({ currentUser, currentPage, navigate, onLogout }) {
  const items = NAV[currentUser?.access] || NAV.user;

  return (
    <div className="sidebar">
      <div className="logo">
        <div style={{ fontSize: 20, marginBottom: 6 }}>📺</div>
        <div className="logo-title">YT Studio Pro</div>
        <div className="logo-sub">Patrika Group</div>
      </div>

      <nav className="nav">
        <div className="nav-section">Menu</div>
        {items.map(item => (
          <div
            key={item.id}
            className={`nav-item${currentPage === item.id ? ' active' : ''}`}
            onClick={() => navigate(item.id)}
          >
            <span className="nav-icon" style={{ fontStyle: 'normal', fontFamily: 'monospace' }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="user-info">
        <div className="user-badge">
          <div className="avatar">{currentUser?.avatar || '?'}</div>
          <div>
            <div className="user-name-side">{currentUser?.name}</div>
            <div className="user-role-side">{currentUser?.role}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          ⏻ Logout
        </button>
      </div>
    </div>
  );
}
