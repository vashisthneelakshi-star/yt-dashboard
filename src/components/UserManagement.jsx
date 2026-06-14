import { useState } from 'react';
import { useApp } from '../AppContext';
import { PERMS_LIST, DEFAULT_PERMS, downloadCSV, todayISO } from '../data/store';

function PermGrid({ perms, onChange }) {
  const toggle = (key) => {
    const next = perms.includes(key) ? perms.filter(p => p !== key) : [...perms, key];
    onChange(next);
  };
  return (
    <div className="perm-grid">
      {PERMS_LIST.map(p => (
        <div key={p.key} className={`perm-item${perms.includes(p.key) ? ' on' : ''}`} onClick={() => toggle(p.key)}>
          <div className="perm-check">{perms.includes(p.key) ? '✓' : ''}</div>
          <span>{p.label}</span>
        </div>
      ))}
    </div>
  );
}

const EVENT_BADGE = { Login: 'badge-green', Logout: 'badge-gray', 'Entry Added': 'badge-blue', 'No Activity': 'badge-red' };

export default function UserManagement() {
  const { users, activityLog, addUser, updateUser, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('list');
  const [addForm, setAddForm] = useState({ name:'', email:'', profile:'Producer', access:'user', perms: DEFAULT_PERMS.user });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [actFilters, setActFilters] = useState({ user:'', from:'', to:'', event:'' });

  // ── Add user ──
  const setAdd = (k, v) => setAddForm(p => ({ ...p, [k]: v }));
  const handleAccessChange = (access) => {
    setAddForm(p => ({ ...p, access, perms: DEFAULT_PERMS[access] || [] }));
  };

  const submitAdd = () => {
    if (!addForm.name.trim() || !addForm.email.trim()) {
      showToast('Name and Email are required', 'error'); return;
    }
    addUser({ name: addForm.name, email: addForm.email, profile: addForm.profile, access: addForm.access, perms: addForm.perms });
    showToast(`✅ ${addForm.name} added to team!`);
    setAddForm({ name:'', email:'', profile:'Producer', access:'user', perms: DEFAULT_PERMS.user });
  };

  // ── Edit user ──
  const openEdit = (user) => {
    setEditId(user.id);
    setEditForm({ name: user.name, email: user.email, profile: user.role, access: user.access, perms: [...user.perms], status: user.status });
  };
  const saveEdit = () => {
    updateUser(editId, { name: editForm.name, email: editForm.email, role: editForm.profile, access: editForm.access, perms: editForm.perms, status: editForm.status });
    showToast('✅ User updated!');
    setEditId(null); setEditForm(null);
  };

  // ── Activity log ──
  const filteredAct = activityLog.filter(a => {
    if (actFilters.user  && a.user  !== actFilters.user)  return false;
    if (actFilters.from  && a.time  <  actFilters.from)   return false;
    if (actFilters.to    && a.time  >  actFilters.to)     return false;
    if (actFilters.event && a.event !== actFilters.event) return false;
    return true;
  });

  const todayStr = todayISO();
  const todayLoggedIn = new Set(activityLog.filter(a => a.time.startsWith(todayStr) && a.event === 'Login').map(a => a.user));
  const absent = users.filter(u => !todayLoggedIn.has(u.name) && u.status === 'active');

  const downloadLog = () => {
    downloadCSV(
      [['Time','Member','Event','Role','Device','Duration'], ...filteredAct.map(a => [a.time, a.user, a.event, a.role, a.device, a.duration])],
      `activity_log_${todayStr}.csv`
    );
  };

  const roleColors = { user: 'badge-blue', incharge: 'badge-amber', admin: 'badge-gold' };

  return (
    <div className="page">
      <div className="section-title"><div className="gold-bar" />Team Management</div>

      <div className="tab-bar">
        {[['list','👥 Members'],['add','➕ Add Member'],['activity','📋 Activity Log']].map(([id, label]) => (
          <div key={id} className={`tab${activeTab === id ? ' active' : ''}`} onClick={() => setActiveTab(id)}>{label}</div>
        ))}
      </div>

      {/* ── Members list ── */}
      {activeTab === 'list' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Team Members</div>
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>{users.length} members</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Name</th><th>Profile</th><th>Access</th><th>Videos</th><th>Permissions</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id}>
                    <td style={{ color: 'var(--text3)' }}>{i + 1}</td>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                        <div className="avatar avatar-sm">{u.avatar}</div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{u.name}</div>
                          <div style={{ fontSize: 10, color: 'var(--text3)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-purple">{u.role}</span></td>
                    <td><span className={`badge ${roleColors[u.access] || 'badge-blue'}`}>{u.access}</span></td>
                    <td style={{ fontWeight: 700, color: 'var(--gold)' }}>{u.videos}</td>
                    <td>
                      <div style={{ display:'flex', flexWrap:'wrap', gap: 3 }}>
                        {u.perms.slice(0, 3).map(p => (
                          <span key={p} className="badge badge-gray" style={{ fontSize: 9 }}>{p.replace(/_/g,' ')}</span>
                        ))}
                        {u.perms.length > 3 && <span className="badge badge-gray" style={{ fontSize: 9 }}>+{u.perms.length - 3}</span>}
                      </div>
                    </td>
                    <td><span className={`badge ${u.status === 'active' ? 'badge-green' : 'badge-red'}`}>{u.status}</span></td>
                    <td><button className="btn btn-outline btn-sm" onClick={() => openEdit(u)}>Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Add member ── */}
      {activeTab === 'add' && (
        <div className="card" style={{ maxWidth: 620 }}>
          <div className="card-header"><div className="card-title">Add New Team Member</div></div>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" placeholder="Full Name" value={addForm.name} onChange={e => setAdd('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input type="email" className="form-input" placeholder="name@patrika.com" value={addForm.email} onChange={e => setAdd('email', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Profile</label>
                <select className="form-input" value={addForm.profile} onChange={e => setAdd('profile', e.target.value)}>
                  <option>Producer</option><option>Video Editor</option><option>Graphic Designer</option><option>Incharge</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Access Level</label>
                <select className="form-input" value={addForm.access} onChange={e => handleAccessChange(e.target.value)}>
                  <option value="user">User</option><option value="incharge">Incharge</option><option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Permissions</label>
              <PermGrid perms={addForm.perms} onChange={perms => setAdd('perms', perms)} />
            </div>
            <button className="btn btn-gold" onClick={submitAdd} style={{ marginTop: 6 }}>Add Member</button>
          </div>
        </div>
      )}

      {/* ── Activity log ── */}
      {activeTab === 'activity' && (
        <>
          <div className="filter-bar">
            <span className="filter-label">Filter:</span>
            <select className="form-input" style={{ minWidth: 150 }} value={actFilters.user} onChange={e => setActFilters(p => ({ ...p, user: e.target.value }))}>
              <option value="">All Members</option>
              {users.map(u => <option key={u.id}>{u.name}</option>)}
            </select>
            <input type="date" className="form-input" style={{ width: 130 }} value={actFilters.from} onChange={e => setActFilters(p => ({ ...p, from: e.target.value }))} />
            <input type="date" className="form-input" style={{ width: 130 }} value={actFilters.to}   onChange={e => setActFilters(p => ({ ...p, to:   e.target.value }))} />
            <select className="form-input" style={{ minWidth: 130 }} value={actFilters.event} onChange={e => setActFilters(p => ({ ...p, event: e.target.value }))}>
              <option value="">All Events</option>
              <option>Login</option><option>Logout</option><option>Entry Added</option><option>No Activity</option>
            </select>
            <button className="btn btn-gold btn-sm" onClick={downloadLog}>⬇ Download Log</button>
            <button className="btn btn-outline btn-sm" onClick={() => setActFilters({ user:'',from:'',to:'',event:'' })}>Clear</button>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">📋 Activity Log</div>
              <span style={{ fontSize: 11, color: 'var(--text3)' }}>{filteredAct.length} events</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Time</th><th>Member</th><th>Event</th><th>Role</th><th>Device</th><th>Duration</th></tr></thead>
                <tbody>
                  {filteredAct.length === 0 && (
                    <tr><td colSpan="6" style={{ textAlign:'center', color:'var(--text3)', padding: 24 }}>No activity found</td></tr>
                  )}
                  {filteredAct.map(a => (
                    <tr key={a.id}>
                      <td style={{ fontSize: 11, color: 'var(--text2)', whiteSpace:'nowrap' }}>{a.time}</td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap: 7 }}>
                          <div className="avatar avatar-xs">{a.user.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
                          {a.user}
                        </div>
                      </td>
                      <td><span className={`badge ${EVENT_BADGE[a.event] || 'badge-gray'}`}>{a.event}</span></td>
                      <td style={{ color:'var(--text3)', fontSize: 11 }}>{a.role}</td>
                      <td style={{ color:'var(--text3)', fontSize: 11 }}>{a.device}</td>
                      <td style={{ color:'var(--text3)' }}>{a.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Absent today */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">🚫 Not Logged In Today</div>
              <span style={{ fontSize: 11, color: 'var(--red)', fontWeight: 600 }}>{absent.length} members</span>
            </div>
            <div className="card-body">
              {absent.length === 0
                ? <div style={{ color:'var(--green)', fontWeight: 600 }}>✅ All active members logged in today!</div>
                : <div style={{ display:'flex', flexWrap:'wrap', gap: 10 }}>
                    {absent.map(u => (
                      <div key={u.id} style={{ display:'flex', alignItems:'center', gap: 8, padding:'8px 14px', background:'var(--red-bg)', borderRadius: 8, border:'1px solid rgba(192,57,43,.2)' }}>
                        <div className="avatar avatar-sm" style={{ background:'var(--red-bg)', color:'var(--red)', border:'2px solid var(--red)' }}>{u.avatar}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600 }}>{u.name}</div>
                          <div style={{ fontSize: 10, color:'var(--text3)' }}>{u.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        </>
      )}

      {/* ── Edit modal ── */}
      {editId && editForm && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) { setEditId(null); setEditForm(null); } }}>
          <div className="modal">
            <div className="modal-title">
              ✏️ Edit Member
              <button className="modal-close" onClick={() => { setEditId(null); setEditForm(null); }}>✕</button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" value={editForm.name} onChange={e => setEditForm(p => ({...p, name: e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" value={editForm.email} onChange={e => setEditForm(p => ({...p, email: e.target.value}))} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Profile</label>
                <select className="form-input" value={editForm.profile} onChange={e => setEditForm(p => ({...p, profile: e.target.value}))}>
                  <option>Producer</option><option>Video Editor</option><option>Graphic Designer</option><option>Incharge</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Access Level</label>
                <select className="form-input" value={editForm.access} onChange={e => setEditForm(p => ({...p, access: e.target.value, perms: DEFAULT_PERMS[e.target.value]||[]}))}>
                  <option value="user">User</option><option value="incharge">Incharge</option><option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input" value={editForm.status} onChange={e => setEditForm(p => ({...p, status: e.target.value}))}>
                <option value="active">Active</option><option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Permissions</label>
              <PermGrid perms={editForm.perms} onChange={perms => setEditForm(p => ({...p, perms}))} />
            </div>
            <div style={{ marginTop: 16, display:'flex', gap: 10 }}>
              <button className="btn btn-gold" onClick={saveEdit}>Save Changes</button>
              <button className="btn btn-outline" onClick={() => { setEditId(null); setEditForm(null); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
