'use client'
import { useEffect, useState } from 'react'
import { fmtViews } from '@/lib/utils'

interface Stats { totalVideos:number; totalViews:number; totalShorts:number; totalLong:number; avgViews:number; activeEmployees:number }

function KpiCard({ label, value, icon, sub, color }: { label:string; value:string|number; icon:string; sub?:string; color?:string }) {
  return (
    <div className="bg-white rounded-xl p-5 relative overflow-hidden" style={{border:'1px solid #DDD0B0'}}>
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{background:'linear-gradient(90deg,#B48C28,#DCB950)'}}/>
      <div className="absolute right-4 top-4 text-2xl opacity-15">{icon}</div>
      <div className="text-2xl font-bold" style={{color:'#14120E',fontVariantNumeric:'tabular-nums',letterSpacing:'-.03em',lineHeight:1}}>{value}</div>
      <div className="text-xs uppercase tracking-widest font-semibold mt-1.5" style={{color:'#8C7A50'}}>{label}</div>
      {sub && <div className="text-xs mt-1 font-medium" style={{color:color||'#2D6A4F'}}>{sub}</div>}
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats|null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(()=>{ fetch('/api/dashboard/stats').then(r=>r.json()).then(d=>{setStats(d);setLoading(false)}).catch(()=>setLoading(false)) },[])
  if (loading) return <div className="flex items-center justify-center h-64 text-sm" style={{color:'#8C7A50'}}>Loading...</div>
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-base font-bold" style={{color:'#14120E'}}>Overview</h2>
        <p className="text-xs mt-0.5 flex items-center gap-1.5" style={{color:'#8C7A50'}}><span className="live-dot"/>Real-time · {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KpiCard icon="🎬" label="Total Videos"    value={stats?.totalVideos??0}           sub="All time"/>
        <KpiCard icon="👁"  label="Total Views"     value={fmtViews(stats?.totalViews??0)}  sub="Live count"/>
        <KpiCard icon="⚡"  label="Shorts"          value={stats?.totalShorts??0}           sub="Short format"/>
        <KpiCard icon="🎞"  label="Long Form"       value={stats?.totalLong??0}             sub="Long format"/>
        <KpiCard icon="📊" label="Avg Views"        value={fmtViews(stats?.avgViews??0)}    sub="Per video"/>
        <KpiCard icon="👥" label="Active Members"   value={stats?.activeEmployees??0}       sub="Active users"/>
      </div>
      <div className="bg-white rounded-xl p-8 text-center" style={{border:'1px solid #DDD0B0'}}>
        <div className="text-3xl mb-3">📈</div>
        <p className="text-sm font-semibold" style={{color:'#5C4D2A'}}>Add videos & configure YouTube API to see charts</p>
        <p className="text-xs mt-1" style={{color:'#8C7A50'}}>Go to Settings → Add YouTube API Key</p>
      </div>
    </div>
  )
}
