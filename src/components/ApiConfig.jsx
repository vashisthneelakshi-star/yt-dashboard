import { useState } from 'react';
import { useApp } from '../AppContext';

export default function ApiConfig({ onClose }) {
  const { apiConfig, setApiConfig, showToast } = useApp();
  const [form, setForm] = useState({ ytKey: apiConfig.ytKey, sheetId: apiConfig.sheetId, sheetKey: apiConfig.sheetKey });
  const [testResult, setTestResult] = useState(null);

  const save = () => {
    setApiConfig(form);
    showToast('✅ Config saved! Views will now auto-fetch from YouTube.');
    onClose();
  };

  const testYT = async () => {
    if (!form.ytKey) { setTestResult({ ok: false, msg: 'Enter YouTube API Key first' }); return; }
    setTestResult({ ok: null, msg: 'Testing...' });
    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=dQw4w9WgXcQ&key=${form.ytKey}`);
      const data = await res.json();
      if (data.error) setTestResult({ ok: false, msg: 'Error: ' + data.error.message });
      else setTestResult({ ok: true, msg: '✅ YouTube API working! Views: ' + parseInt(data.items?.[0]?.statistics?.viewCount || 0).toLocaleString() });
    } catch { setTestResult({ ok: false, msg: '❌ Network error — check key' }); }
  };

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-title">
          ⚙️ API Configuration
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="api-box">
          <strong>YouTube API Key kaise milegi:</strong><br />
          1. <code>console.cloud.google.com</code> → New Project banao<br />
          2. APIs &amp; Services → Library → <code>YouTube Data API v3</code> → Enable<br />
          3. Credentials → Create API Key → Copy karo<br /><br />
          <strong>Google Sheets:</strong> Same project mein <code>Google Sheets API</code> enable karo → Service Account banao → JSON key download karo (backend ke liye)
        </div>

        <div className="form-group">
          <label className="form-label">YouTube Data API v3 Key</label>
          <input className="form-input" placeholder="AIzaSy..." value={form.ytKey} onChange={e => setForm(p => ({...p, ytKey: e.target.value}))} />
        </div>
        <div className="form-group">
          <label className="form-label">Google Sheet ID</label>
          <input className="form-input" placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms" value={form.sheetId} onChange={e => setForm(p => ({...p, sheetId: e.target.value}))} />
        </div>
        <div className="form-group">
          <label className="form-label">Sheets API Key</label>
          <input className="form-input" placeholder="Same as YT key (if same GCP project)" value={form.sheetKey} onChange={e => setForm(p => ({...p, sheetKey: e.target.value}))} />
        </div>

        {testResult && (
          <div style={{
            padding: '9px 14px', borderRadius: 8, marginBottom: 14, fontSize: 12,
            background: testResult.ok === true ? 'var(--green-bg)' : testResult.ok === false ? 'var(--red-bg)' : 'var(--cream2)',
            color: testResult.ok === true ? 'var(--green)' : testResult.ok === false ? 'var(--red)' : 'var(--text2)',
          }}>{testResult.msg}</div>
        )}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-gold" onClick={save}>Save Config</button>
          <button className="btn btn-outline btn-sm" onClick={testYT}>Test YT API</button>
        </div>
      </div>
    </div>
  );
}
