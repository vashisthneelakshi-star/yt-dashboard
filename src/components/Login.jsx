import { useState } from 'react';

// Demo credentials — production mein backend/Sheets se match karna
const CREDENTIALS = [
  { username: 'admin',     password: 'admin123',   name: 'Admin User',   role: 'Administrator', access: 'admin',    avatar: 'AD' },
  { username: 'anjali',    password: 'incharge123', name: 'Anjali Mehta', role: 'Incharge',      access: 'incharge', avatar: 'AM' },
  { username: 'rahul',     password: 'user123',     name: 'Rahul Sharma', role: 'Producer',      access: 'user',     avatar: 'RS' },
  { username: 'priya',     password: 'user123',     name: 'Priya Singh',  role: 'Video Editor',  access: 'user',     avatar: 'PS' },
  { username: 'vikram',    password: 'user123',     name: 'Vikram Joshi', role: 'Video Editor',  access: 'user',     avatar: 'VJ' },
  { username: 'neha',      password: 'user123',     name: 'Neha Gupta',   role: 'Graphic Designer', access: 'user', avatar: 'NG' },
];

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = () => {
    if (!username || !password) { setError('Username aur password dono enter karo'); return; }
    setLoading(true);
    setError('');

    setTimeout(() => {
      const user = CREDENTIALS.find(
        c => c.username === username.trim().toLowerCase() && c.password === password
      );
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid username ya password');
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <div className="login-logo-icon">📺</div>
          <div className="login-logo-title">YT Studio Pro</div>
          <div className="login-logo-sub">Patrika Group</div>
        </div>

        <hr className="login-divider" />

        {error && <div className="login-error">{error}</div>}

        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            className="form-input"
            placeholder="Enter username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />
        </div>

        <div className="form-group" style={{ marginBottom: 20 }}>
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <button className="btn btn-gold" style={{ width: '100%', padding: 10, fontSize: 13 }}
          onClick={handleSubmit} disabled={loading}>
          {loading ? 'Logging in...' : 'Login →'}
        </button>

        {/* Demo hint */}
        <div style={{ marginTop: 20, padding: '12px 14px', background: 'var(--ivory2)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 11, color: 'var(--text3)', lineHeight: 1.7 }}>
          <div style={{ fontWeight: 700, color: 'var(--text2)', marginBottom: 4 }}>Demo Credentials:</div>
          <div><b>Admin:</b> admin / admin123</div>
          <div><b>Incharge:</b> anjali / incharge123</div>
          <div><b>User:</b> rahul / user123</div>
        </div>
      </div>
    </div>
  );
}
