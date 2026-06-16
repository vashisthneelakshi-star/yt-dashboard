'use client'
import { useEffect, useState } from 'react'
import { fmtViews, fmtDate } from '@/lib/utils'

export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/videos?limit=20').then(r=>r.json()).then(d=>{ setVideos(d.items||[]); setTotal(d.total||0); setLoading(false) })
  }, [])

  const CAT_COLOR: Record<string,string> = { VO:'#1A4D80', BYTE:'#78141E', AI:'#2D6A4F', INTERVIEW:'#5C3480', GROUND_REPORT:'#8C5A0A', SPECIAL:'#B48C28', OTHER:'#5C4D2A' }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold" style={{color:'#14120E'}}>Video Log</h2>
          <p className="text-xs mt-0.5" style={{color:'#8C7A50'}}>{total} total videos</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{borderColor:'#DDD0B0'}}>
        {loading ? (
          <div className="flex items-center justify-center h-40 text-sm" style={{color:'#8C7A50'}}>Loading videos...</div>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40">
            <div className="text-3xl mb-2">🎬</div>
            <p className="text-sm font-semibold" style={{color:'#5C4D2A'}}>No videos yet</p>
            <p className="text-xs mt-1" style={{color:'#8C7A50'}}>Add your first entry from Add Entry page</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{background:'#FAF5EB',borderBottom:'1.5px solid #DDD0B0'}}>
                  {['#','Date','Title','Producer','Category','Format','Views','Likes'].map(h=>(
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{color:'#8C7A50'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {videos.map((v,i) => (
                  <tr key={v.id} className="border-b hover:bg-[#FAF5EB] transition-colors" style={{borderColor:'#EBE1C8'}}>
                    <td className="px-4 py-3 text-xs" style={{color:'#8C7A50'}}>{i+1}</td>
                    <td className="px-4 py-3 text-xs" style={{color:'#5C4D2A'}}>{fmtDate(v.date)}</td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <a href={v.youtubeUrl} target="_blank" rel="noreferrer" className="font-medium hover:underline line-clamp-2" style={{color:'#B48C28'}}>{v.videoTitle}</a>
                    </td>
                    <td className="px-4 py-3 text-xs font-medium" style={{color:'#14120E'}}>{v.userName}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{background:`${CAT_COLOR[v.category]}20`,color:CAT_COLOR[v.category]||'#5C4D2A'}}>{v.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{background:v.format==='SHORT'?'#FDF3E0':'#E6EEF8',color:v.format==='SHORT'?'#8C5A0A':'#1A4D80'}}>{v.format}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-xs" style={{color:'#14120E'}}>{fmtViews(v.views)}</td>
                    <td className="px-4 py-3 text-xs" style={{color:'#5C4D2A'}}>{v.likes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
