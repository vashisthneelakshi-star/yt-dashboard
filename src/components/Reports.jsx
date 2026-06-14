import { useState } from 'react';
import { useApp } from '../AppContext';
import { fmtViews, downloadCSV } from '../data/store';

const PERIODS = ['Daily','Weekly','Fortnightly','Monthly','Half-Yearly','Yearly'];

export default function Reports() {
  const { users } = useApp();
  const [period, setPeriod] = useState('Daily');

  const sorted = [...users].sort((a, b) => b.videos - a.videos);

  const getStatus = (videos) => {
    if (videos >= 60) return <span className="badge badge-green">Excellent</span>;
    if (videos >= 45) return <span className="badge badge-amber">Good</span>;
    if (videos >= 30) return <span className="badge badge-gold">Average</span>;
    return <span className="badge badge-red">Below Target</span>;
  };

  const handleDownload = () => {
    const rows = [
      ['Rank','Name','Role','Videos','Total Views','Shorts','Long Form','Avg Views/Video','Status'],
      ...sorted.map((u, i) => {
        const sh = Math.round(u.videos * 0.52);
        const avg = u.videos > 0 ? Math.round(u.views / u.videos) : 0;
        const status = u.videos >= 60 ? 'Excellent' : u.videos >= 45 ? 'Good' : u.videos >= 30 ? 'Average' : 'Below Target';
        return [i+1, u.name, u.role, u.videos, u.views, sh, u.videos - sh, avg, status];
      }),
    ];
    downloadCSV(rows, `yt_report_${period.toLowerCase()}_${new Date().toISOString().slice(0,10)}.csv`);
  };

  return (
    <div className="page">
      <div className="section-title"><div className="gold-bar" />Reports & Analytics</div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 600 }}>Period:</span>
        {PERIODS.map(p => (
          <button key={p} className={`period-btn${period === p ? ' active' : ''}`} onClick={() => setPeriod(p)}>
            {p}
          </button>
        ))}
        <button className="btn btn-gold btn-sm" style={{ marginLeft: 10 }} onClick={handleDownload}>
          ⬇ Download CSV
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">📈 Performance Report</div>
          <div style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 600 }}>{period} Report</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Rank</th><th>Name</th><th>Role</th><th>Videos</th>
                <th>Views</th><th>Shorts</th><th>Long</th><th>Avg Views</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((u, i) => {
                const sh = Math.round(u.videos * 0.52);
                const avg = u.videos > 0 ? Math.round(u.views / u.videos) : 0;
                const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-n';
                return (
                  <tr key={u.id}>
                    <td><div className={`rank-badge ${rankClass}`}>{i + 1}</div></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="avatar avatar-sm">{u.avatar}</div>
                        {u.name}
                      </div>
                    </td>
                    <td><span className="badge badge-blue">{u.role}</span></td>
                    <td style={{ fontWeight: 700, color: 'var(--gold)' }}>{u.videos}</td>
                    <td>{fmtViews(u.views)}</td>
                    <td>{sh}</td>
                    <td>{u.videos - sh}</td>
                    <td>{fmtViews(avg)}</td>
                    <td>{getStatus(u.videos)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
