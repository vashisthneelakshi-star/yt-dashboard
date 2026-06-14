import { useState } from 'react';
import { useApp } from '../AppContext';
import { todayISO } from '../data/store';

const ROLE_USER = {
  admin:    'Admin User',
  incharge: 'Anjali Mehta',
  user:     'Rahul Sharma',
};

export default function EntryForm({ currentRole }) {
  const { users, videoTypes, addVideo, addVideoType, showToast } = useApp();
  const userName = ROLE_USER[currentRole];

  const [form, setForm] = useState({ date: todayISO(), count: '', type: videoTypes[0], format: 'Short', title: '', link: '', editor: '', designer: '', notes: '' });
  const [showTypeAdder, setShowTypeAdder] = useState(false);
  const [newType, setNewType] = useState('');
  const [msg, setMsg] = useState(null);

  const editors   = users.filter(u => u.role === 'Video Editor');
  const designers = users.filter(u => u.role === 'Graphic Designer');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.date || !form.count || !form.link) {
      setMsg({ text: '⚠️ Date, Video Count, and YouTube Link are required.', ok: false });
      return;
    }
    addVideo(form, userName);
    setMsg({ text: '✅ Entry submitted! Link saved for auto-views tracking.', ok: true });
    setForm(p => ({ ...p, count: '', title: '', link: '', editor: '', designer: '', notes: '' }));
    setTimeout(() => setMsg(null), 3000);
  };

  const handleAddType = () => {
    const t = newType.trim();
    if (t) {
      addVideoType(t);
      set('type', t);
      showToast(`✅ Type "${t}" added!`);
    }
    setNewType('');
    setShowTypeAdder(false);
  };

  return (
    <div className="page">
      <div className="section-title">
        <div className="gold-bar" />
        Daily Video Entry
      </div>

      <div className="card" style={{ maxWidth: 700 }}>
        <div className="card-header">
          <div className="card-title">➕ Add New Entry</div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>
            Logged as: <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{userName}</span>
          </div>
        </div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input type="date" className="form-input" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Number of Videos *</label>
              <input type="number" className="form-input" min="1" max="50" placeholder="e.g. 3"
                value={form.count} onChange={e => set('count', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Video Type *</label>
              <div style={{ display: 'flex', gap: 7 }}>
                <select className="form-input" style={{ flex: 1 }} value={form.type} onChange={e => set('type', e.target.value)}>
                  {videoTypes.map(t => <option key={t}>{t}</option>)}
                </select>
                <button className="btn btn-outline btn-sm" onClick={() => setShowTypeAdder(s => !s)}>
                  + Custom
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Video Format *</label>
              <select className="form-input" value={form.format} onChange={e => set('format', e.target.value)}>
                <option>Short</option>
                <option>Long</option>
              </select>
            </div>
          </div>

          {showTypeAdder && (
            <div style={{ background: 'var(--cream2)', border: '1px solid var(--border)', borderRadius: 8, padding: 12, marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Add Custom Video Type</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="form-input" style={{ flex: 1 }} placeholder="e.g. Explainer, Documentary..."
                  value={newType} onChange={e => setNewType(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddType()} />
                <button className="btn btn-gold btn-sm" onClick={handleAddType}>Add</button>
                <button className="btn btn-outline btn-sm" onClick={() => setShowTypeAdder(false)}>✕</button>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Video Title</label>
            <input type="text" className="form-input" placeholder="Enter video title"
              value={form.title} onChange={e => set('title', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">YouTube Link * (used for auto-views fetch)</label>
            <input type="url" className="form-input" placeholder="https://youtu.be/xxxxx  or  https://youtube.com/watch?v=xxxxx"
              value={form.link} onChange={e => set('link', e.target.value)} />
          </div>

          {currentRole !== 'user' && (
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Video Editor</label>
                <select className="form-input" value={form.editor} onChange={e => set('editor', e.target.value)}>
                  <option value="">-- Select Editor --</option>
                  {editors.map(u => <option key={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Graphic Designer</label>
                <select className="form-input" value={form.designer} onChange={e => set('designer', e.target.value)}>
                  <option value="">-- Select Designer --</option>
                  {designers.map(u => <option key={u.id}>{u.name}</option>)}
                </select>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Notes / Remarks</label>
            <textarea className="form-input" rows="2" placeholder="Optional notes..."
              value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-gold" onClick={submit}>✅ Submit Entry</button>
            <button className="btn btn-outline" onClick={() => setForm(p => ({ ...p, count:'',title:'',link:'',notes:'' }))}>Clear</button>
          </div>

          {msg && (
            <div style={{
              marginTop: 12, padding: '9px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
              background: msg.ok ? 'var(--green-bg)' : 'var(--amber-bg)',
              color: msg.ok ? 'var(--green)' : 'var(--amber)',
            }}>
              {msg.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
