import { useApp } from '../AppContext';
import { fmtViews, downloadCSV, todayISO } from '../data/store';

const ROLE_USER = { admin:'Admin User', incharge:'Anjali Mehta', user:'Rahul Sharma' };
const TYPE_CLASS = { Byte:'chip-byte', VO:'chip-vo', AI:'chip-ai', Other:'chip-other' };
const EVENT_BADGE = { Login:'badge-green', Logout:'badge-gray', 'Entry Added':'badge-blue', 'No Activity':'badge-red' };

export default function MyProfile({ currentRole }) {
  const { users, videos, activityLog } = useApp();
  const userName = ROLE_USER[currentRole];
  const user = users.find(u => u.name === userName) || users[0];

  const myVideos   = videos.filter(v => v.producer === user.name || v.editor === user.name || v.designer === user.name);
  const myActivity = activityLog.filter(a => a.user === user.name);
  const avg        = user.videos > 0 ? Math.round(user.views / user.videos) : 0;

  const downloadLog = () => {
    downloadCSV(
      [['Time','Event','Device','Duration'], ...myActivity.map(a => [a.time, a.event, a.device, a.duration])],
      `my_log_${user.name.replace(/ /g,'_')}_${todayISO()}.csv`
    );
  };

  return (
    <div className="page">
      <div className="section-title"><div className="gold-bar" />My Performance</div>

      {/* Stats */}
      <div className="grid-3">
        <div className="metric-card">
          <div className="metric-icon">🎬</div>
          <div className="metric-value">{user.videos}</div>
          <div className="metric-label">Videos This Month</div>
          <div className="metric-sub">{user.videos >= 50 ? '✅ Target Met' : `⚠️ Need ${50 - user.videos} more`}</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">👁️</div>
          <div className="metric-value">{fmtViews(user.views)}</div>
          <div className="metric-label">Total Views</div>
          <div className="metric-sub"><span className="live-dot" /> Live count</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-value">{fmtViews(avg)}</div>
          <div className="metric-label">Avg Views / Video</div>
          <div className="metric-sub">Keep it up!</div>
        </div>
      </div>

      {/* My videos */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">🎬 My Videos</div>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>{myVideos.length} videos</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Date</th><th>Title</th><th>Type</th><th>Format</th><th>Views</th><th>Link</th></tr>
            </thead>
            <tbody>
              {myVideos.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign:'center', color:'var(--text3)', padding: 28 }}>No videos yet. Start adding entries!</td></tr>
              )}
              {myVideos.map(v => (
                <tr key={v.id}>
                  <td style={{ color:'var(--text2)' }}>{v.date}</td>
                  <td>{v.title}</td>
                  <td><span className={`chip ${TYPE_CLASS[v.type] || 'chip-other'}`}>{v.type}</span></td>
                  <td><span className={`chip ${v.format === 'Short' ? 'chip-short' : 'chip-long'}`}>{v.format}</span></td>
                  <td>
                    <div className="views-cell">
                      <span className="live-dot" />
                      {fmtViews(v.views)}
                    </div>
                  </td>
                  <td>
                    <a href={v.link} target="_blank" rel="noreferrer"
                      style={{ color:'var(--gold)', fontWeight:700, textDecoration:'none' }}>▶ Watch</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* My activity */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">📋 My Activity Log</div>
          <button className="btn btn-outline btn-sm" onClick={downloadLog}>⬇ Download</button>
        </div>
        <div className="card-body">
          {myActivity.length === 0
            ? <div style={{ color:'var(--text3)', textAlign:'center', padding: 20 }}>No activity recorded yet.</div>
            : myActivity.slice(0, 20).map((a, i) => (
                <div key={i} className="log-row">
                  <div style={{ fontSize: 11, color:'var(--text3)', width: 160, flexShrink: 0 }}>{a.time}</div>
                  <span className={`badge ${EVENT_BADGE[a.event] || 'badge-gray'}`}>{a.event}</span>
                  <div style={{ paddingLeft: 10, color:'var(--text2)', flex: 1, fontSize: 12 }}>{a.device}</div>
                  <div style={{ fontSize: 11, color:'var(--text3)' }}>{a.duration}</div>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}
