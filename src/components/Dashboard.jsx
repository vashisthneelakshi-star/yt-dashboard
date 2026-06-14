import { useState } from 'react';
import { useApp } from '../AppContext';
import { fmtViews } from '../data/store';

function ChartBar({ label, value, max, color }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="chart-bar-item">
      <div className="chart-bar-name">{label}</div>
      <div className="chart-bar-bg">
        <div className="chart-bar-fill" style={{ width: `${pct}%`, background: color }}>
          {value}
        </div>
      </div>
      <div className="chart-bar-val">{value}</div>
    </div>
  );
}

function PerformerRow({ user, rank, worst }) {
  const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-n';
  return (
    <div className="performer-row">
      <div className={`rank-badge ${worst ? '' : rankClass}`}
        style={worst ? { background: 'var(--red-bg)', color: 'var(--red)' } : {}}>
        {rank}
      </div>
      <div className="avatar avatar-sm">{user.avatar}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>{user.name}</div>
        <div style={{ fontSize: 10, color: 'var(--text3)' }}>{user.role}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 700, color: worst ? 'var(--red)' : 'var(--gold)' }}>{user.videos}</div>
        <div style={{ fontSize: 10, color: 'var(--text3)' }}>
          {worst ? `Gap: ${Math.max(0, 50 - user.videos)}` : fmtViews(user.views)}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { users, videos } = useApp();
  const [topN, setTopN] = useState(5);
  const [topRole, setTopRole] = useState('all');
  const [worstN, setWorstN] = useState(5);

  const totalVideos = users.reduce((a, u) => a + u.videos, 0);
  const totalViews  = users.reduce((a, u) => a + u.views, 0);
  const activeCount = users.filter(u => u.status === 'active').length;
  const avgPerPerson = activeCount ? (totalVideos / activeCount).toFixed(1) : 0;

  const typeCount = videos.reduce((acc, v) => { acc[v.type] = (acc[v.type] || 0) + 1; return acc; }, {});
  const typeData = [
    { label: 'Byte',  value: typeCount['Byte']  || 0, color: 'var(--blue)'   },
    { label: 'VO',    value: typeCount['VO']    || 0, color: 'var(--purple)' },
    { label: 'AI',    value: typeCount['AI']    || 0, color: 'var(--green)'  },
    { label: 'Other', value: typeCount['Other'] || 0, color: 'var(--text3)'  },
  ];
  const typeMax = Math.max(...typeData.map(d => d.value), 1);

  const shortCount = videos.filter(v => v.format === 'Short').length;
  const longCount  = videos.filter(v => v.format === 'Long').length;
  const fmtMax = Math.max(shortCount, longCount, 1);

  let sorted = [...users].sort((a, b) => b.videos - a.videos);
  if (topRole !== 'all') sorted = sorted.filter(u => u.role === topRole);
  const topPerformers = sorted.slice(0, topN);
  const worstPerformers = [...users].sort((a, b) => a.videos - b.videos).slice(0, worstN);

  return (
    <div className="page">
      {/* Metrics */}
      <div className="grid-4">
        <div className="metric-card">
          <div className="metric-icon">🎬</div>
          <div className="metric-value">{totalVideos.toLocaleString()}</div>
          <div className="metric-label">Total Videos</div>
          <div className="metric-sub">↑ 18% vs last month</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">👁️</div>
          <div className="metric-value">{fmtViews(totalViews)}</div>
          <div className="metric-label">Total Views</div>
          <div className="metric-sub"><span className="live-dot" /> Real-time</div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-value">{activeCount}</div>
          <div className="metric-label">Active Members</div>
          <div className="metric-sub">
            {users.filter(u => u.role === 'Producer').length} Prod ·{' '}
            {users.filter(u => u.role === 'Video Editor').length} Ed ·{' '}
            {users.filter(u => u.role === 'Graphic Designer').length} Des
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-value">{avgPerPerson}</div>
          <div className="metric-label">Avg Videos / Person</div>
          <div className="metric-sub">{parseFloat(avgPerPerson) >= 50 ? '✅ Target Met' : '⚠️ Target: 50'}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title">📊 Videos by Type</div></div>
          <div className="card-body">
            <div className="chart-bar-wrap">
              {typeData.map(d => <ChartBar key={d.label} {...d} max={typeMax} />)}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">📺 Short vs Long Format</div></div>
          <div className="card-body">
            <div className="chart-bar-wrap">
              <ChartBar label="Short" value={shortCount} max={fmtMax} color="var(--amber)" />
              <ChartBar label="Long"  value={longCount}  max={fmtMax} color="var(--blue)"  />
            </div>
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--cream3)', display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, color: 'var(--amber)', fontSize: 18 }}>{shortCount}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>Shorts</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, color: 'var(--blue)', fontSize: 18 }}>{longCount}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>Long Form</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 18 }}>{videos.length}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performers */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">🏆 Top Performers</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <select className="form-input" style={{ padding: '4px 8px', fontSize: 11, width: 'auto' }}
                value={topN} onChange={e => setTopN(parseInt(e.target.value))}>
                {[5,10,15,20,25].map(n => <option key={n} value={n}>Top {n}</option>)}
              </select>
              <select className="form-input" style={{ padding: '4px 8px', fontSize: 11, width: 'auto' }}
                value={topRole} onChange={e => setTopRole(e.target.value)}>
                <option value="all">All Roles</option>
                <option value="Producer">Producer</option>
                <option value="Video Editor">Editor</option>
                <option value="Graphic Designer">Designer</option>
              </select>
            </div>
          </div>
          <div className="card-body scrollable">
            {topPerformers.length
              ? topPerformers.map((u, i) => <PerformerRow key={u.id} user={u} rank={i + 1} />)
              : <div style={{ color: 'var(--text3)', textAlign: 'center', padding: 20 }}>No data for filter</div>
            }
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">⚠️ Needs Attention</div>
            <select className="form-input" style={{ padding: '4px 8px', fontSize: 11, width: 'auto' }}
              value={worstN} onChange={e => setWorstN(parseInt(e.target.value))}>
              <option value="5">Worst 5</option>
              <option value="10">Worst 10</option>
            </select>
          </div>
          <div className="card-body scrollable">
            {worstPerformers.map((u, i) => <PerformerRow key={u.id} user={u} rank={i + 1} worst />)}
          </div>
        </div>
      </div>
    </div>
  );
}
