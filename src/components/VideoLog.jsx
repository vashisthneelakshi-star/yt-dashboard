import { useState, useMemo, useCallback } from 'react';
import { useApp } from '../AppContext';
import { fmtViews, extractVideoId } from '../data/store';

const TYPE_CLASS = { Byte: 'chip-byte', VO: 'chip-vo', AI: 'chip-ai', Other: 'chip-other' };

export default function VideoLog() {
  const { videos, apiConfig, updateVideoViews, showToast } = useApp();
  const [filters, setFilters] = useState({ from: '', to: '', producer: '', editor: '', designer: '', type: '', format: '' });
  const [refreshing, setRefreshing] = useState(false);

  const producers  = [...new Set(videos.map(v => v.producer))];
  const editors    = [...new Set(videos.map(v => v.editor).filter(e => e !== '-'))];
  const designers  = [...new Set(videos.map(v => v.designer).filter(d => d !== '-'))];
  const videoTypes = [...new Set(videos.map(v => v.type))];

  const filtered = useMemo(() => {
    return videos.filter(v => {
      if (filters.from && v.date < filters.from) return false;
      if (filters.to   && v.date > filters.to)   return false;
      if (filters.producer && v.producer !== filters.producer) return false;
      if (filters.editor   && v.editor   !== filters.editor)   return false;
      if (filters.designer && v.designer !== filters.designer) return false;
      if (filters.type     && v.type     !== filters.type)     return false;
      if (filters.format   && v.format   !== filters.format)   return false;
      return true;
    });
  }, [videos, filters]);

  const setF = (key, val) => setFilters(p => ({ ...p, [key]: val }));
  const clearFilters = () => setFilters({ from:'',to:'',producer:'',editor:'',designer:'',type:'',format:'' });

  /* ── YouTube API fetch ── */
  const fetchViews = useCallback(async () => {
    const key = apiConfig.ytKey;
    if (!key) {
      showToast('⚙️ Add YouTube API Key in Config first', 'warn');
      return;
    }
    setRefreshing(true);
    const ids = videos.map(v => v.videoId).filter(Boolean);
    // batch 50
    for (let i = 0; i < ids.length; i += 50) {
      const batch = ids.slice(i, i + 50).join(',');
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${batch}&key=${key}`
        );
        const data = await res.json();
        if (data.error) { showToast('YT API: ' + data.error.message, 'error'); break; }
        data.items?.forEach(item => {
          updateVideoViews(item.id, parseInt(item.statistics.viewCount) || 0);
        });
      } catch {
        showToast('Network error during views fetch', 'error');
        break;
      }
    }
    setRefreshing(false);
    showToast('✅ Views refreshed from YouTube!');
  }, [apiConfig.ytKey, videos, updateVideoViews, showToast]);

  // Demo refresh (no API key)
  const demoRefresh = () => {
    videos.forEach(v => updateVideoViews(v.videoId, v.views + Math.floor(Math.random() * 500 + 50)));
    showToast('Demo: Views simulated. Add API key for real data.');
  };

  return (
    <div className="page">
      {/* Filter bar */}
      <div className="filter-bar">
        <span className="filter-label">Filter:</span>
        <input type="date" className="form-input" style={{ width: 130 }} value={filters.from} onChange={e => setF('from', e.target.value)} />
        <span style={{ color: 'var(--text3)' }}>→</span>
        <input type="date" className="form-input" style={{ width: 130 }} value={filters.to} onChange={e => setF('to', e.target.value)} />
        <Select val={filters.producer} onChange={v => setF('producer', v)} opts={producers} label="All Producers" />
        <Select val={filters.editor}   onChange={v => setF('editor',   v)} opts={editors}   label="All Editors"   />
        <Select val={filters.designer} onChange={v => setF('designer', v)} opts={designers} label="All Designers" />
        <Select val={filters.type}     onChange={v => setF('type',     v)} opts={videoTypes} label="All Types"    />
        <Select val={filters.format}   onChange={v => setF('format',   v)} opts={['Short','Long']} label="All Formats" />
        <button className="btn btn-outline btn-sm" onClick={clearFilters}>Clear</button>
        <button className="btn btn-gold btn-sm" onClick={apiConfig.ytKey ? fetchViews : demoRefresh} disabled={refreshing}>
          {refreshing ? '⏳ Fetching...' : '🔄 Refresh Views'}
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            🎬 Video Log
            <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 400 }}>({filtered.length} videos)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text3)' }}>
            <span className="live-dot" />
            Views auto-refreshes on button click
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Date</th><th>Producer</th><th>Title</th>
                <th>Type</th><th>Format</th><th>Views</th>
                <th>Editor</th><th>Designer</th><th>Link</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan="10" style={{ textAlign: 'center', color: 'var(--text3)', padding: 32 }}>No videos match the filter</td></tr>
              )}
              {filtered.map((v, i) => (
                <tr key={v.id}>
                  <td style={{ color: 'var(--text3)' }}>{i + 1}</td>
                  <td style={{ color: 'var(--text2)' }}>{v.date}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div className="avatar avatar-xs">{v.producer.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
                      {v.producer}
                    </div>
                  </td>
                  <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title}</td>
                  <td><span className={`chip ${TYPE_CLASS[v.type] || 'chip-other'}`}>{v.type}</span></td>
                  <td><span className={`chip ${v.format === 'Short' ? 'chip-short' : 'chip-long'}`}>{v.format}</span></td>
                  <td>
                    <div className="views-cell">
                      <span className="live-dot" />
                      {fmtViews(v.views)}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text2)' }}>{v.editor}</td>
                  <td style={{ color: 'var(--text2)' }}>{v.designer}</td>
                  <td>
                    <a href={v.link} target="_blank" rel="noreferrer"
                      style={{ color: 'var(--gold)', fontWeight: 700, textDecoration: 'none' }}>▶ Watch</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Select({ val, onChange, opts, label }) {
  return (
    <select className="form-input" style={{ minWidth: 110, padding: '6px 8px' }} value={val} onChange={e => onChange(e.target.value)}>
      <option value="">{label}</option>
      {opts.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}
