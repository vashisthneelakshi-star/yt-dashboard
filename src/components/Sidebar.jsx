const NAV = {
  admin: [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'videos',    icon: '🎬', label: 'Video Log' },
    { id: 'reports',   icon: '📈', label: 'Reports' },
    { id: 'users',     icon: '👥', label: 'Team & Users' },
    { id: 'entry',     icon: '➕', label: 'Add Entry' },
  ],
  incharge: [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'videos',    icon: '🎬', label: 'Video Log' },
    { id: 'reports',   icon: '📈', label: 'Reports' },
    { id: 'entry',     icon: '➕', label: 'Add Entry' },
  ],
  user: [
    { id: 'profile', icon: '👤', label: 'My Performance' },
    { id: 'entry',   icon: '➕', label: 'Add Entry' },
  ],
};

const ROLE_DEMO = {
  admin:    { name: 'Admin User',    role: 'Administrator', avatar: 'AD' },
  incharge: { name: 'Anjali Mehta',  role: 'Incharge',      avatar: 'AM' },
  user:     { name: 'Rahul Sharma',  role: 'Producer',      avatar: 'RS' },
};

export default function Sidebar({ currentRole, setCurrentRole, currentPage, navigate }) {
  const items = NAV[currentRole] || [];
  const u = ROLE_DEMO[currentRole];

  return (
    <div className="sidebar">
      <div className="logo">
        <div className="logo-icon">📺</div>
        <div className="logo-title">YT Studio Pro</div>
        <div className="logo-sub">Patrika Group</div>
      </div>

      <nav className="nav">
        <div className="nav-section">Navigation</div>
        {items.map(item => (
          <div
            key={item.id}
            className={`nav-item${currentPage === item.id ? ' active' : ''}`}
            onClick={() => navigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="user-info">
        <div className="user-badge">
          <div className="avatar">{u.avatar}</div>
          <div>
            <div className="user-name-side">{u.name}</div>
            <div className="user-role-side">{u.role}</div>
          </div>
        </div>
        <div style={{ marginTop: 8, fontSize: 10, color: 'rgba(184,150,46,.45)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>
          Switch Role (Demo)
        </div>
        <select
          className="role-switcher"
          value={currentRole}
          onChange={e => setCurrentRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="incharge">Incharge</option>
          <option value="user">User / Producer</option>
        </select>
      </div>
    </div>
  );
}
