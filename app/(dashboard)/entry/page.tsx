'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

const CATEGORIES = ['VO','BYTE','AI','INTERVIEW','GROUND_REPORT','SPECIAL','OTHER']
const ROLES = ['PRODUCER','VIDEO_EDITOR','GRAPHIC_DESIGNER']

export default function EntryPage() {
  const { data:session } = useSession()
  const [form, setForm] = useState({ date:new Date().toISOString().slice(0,10), videoTitle:'', youtubeUrl:'', format:'SHORT', category:'BYTE', contributionRole:'PRODUCER', remarks:'' })
  const [ytData, setYtData] = useState<any>(null)
  const [fetching, setFetching] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{text:string;ok:boolean}|null>(null)

  const set = (k:string,v:string) => setForm(p=>({...p,[k]:v}))

  const fetchYT = async () => {
    if (!form.youtubeUrl) return
    setFetching(true); setYtData(null)
    const res = await fetch('/api/youtube/fetch',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:form.youtubeUrl})})
    const d = await res.json()
    if (d.success) { setYtData(d.data); set('videoTitle', d.data.title) }
    else setMsg({text:d.error||'Could not fetch video data. Check API key in Settings.',ok:false})
    setFetching(false)
  }

  const submit = async () => {
    if (!form.date||!form.videoTitle||!form.youtubeUrl) { setMsg({text:'Date, Title, and YouTube URL are required',ok:false}); return }
    setSaving(true)
    const payload = { ...form, thumbnailUrl:ytData?.thumbnailUrl, channelName:ytData?.channelName, publishedAt:ytData?.publishedAt, duration:ytData?.duration, views:ytData?.views||0, likes:ytData?.likes||0, comments:ytData?.comments||0 }
    const res = await fetch('/api/videos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    const d = await res.json()
    if (d.success) { setMsg({text:'Entry submitted successfully!',ok:true}); setForm(p=>({...p,videoTitle:'',youtubeUrl:'',remarks:''})); setYtData(null) }
    else setMsg({text:d.error||'Failed to submit',ok:false})
    setSaving(false)
  }

  const inputCls = "w-full px-3 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2" 
  const inputStyle = {background:'#FAF5EB',borderColor:'#DDD0B0',color:'#14120E'}
  const labelCls = "block text-xs font-bold uppercase tracking-wider mb-1.5"
  const labelStyle = {color:'#5C4D2A'}

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-bold" style={{color:'#14120E'}}>Add Video Entry</h2>
        <p className="text-xs mt-0.5" style={{color:'#8C7A50'}}>Logged as: <span style={{color:'#B48C28',fontWeight:700}}>{session?.user?.name}</span></p>
      </div>

      <div className="bg-white rounded-xl border p-6 space-y-4" style={{borderColor:'#DDD0B0'}}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={labelStyle}>Date *</label>
            <input type="date" className={inputCls} style={inputStyle} value={form.date} onChange={e=>set('date',e.target.value)}/>
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Format *</label>
            <select className={inputCls} style={inputStyle} value={form.format} onChange={e=>set('format',e.target.value)}>
              <option value="SHORT">Short</option><option value="LONG">Long</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls} style={labelStyle}>YouTube URL * <span style={{color:'#B48C28'}}>(auto-fetches title & stats)</span></label>
          <div className="flex gap-2">
            <input type="url" className={inputCls} style={inputStyle} placeholder="https://youtu.be/..." value={form.youtubeUrl} onChange={e=>set('youtubeUrl',e.target.value)}/>
            <button onClick={fetchYT} disabled={fetching||!form.youtubeUrl} className="px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap" style={{background:'#B48C28',color:'#fff',opacity:(fetching||!form.youtubeUrl)?0.6:1}}>
              {fetching?'Fetching...':'Fetch Info'}
            </button>
          </div>
        </div>

        {ytData && (
          <div className="flex gap-3 p-3 rounded-lg border" style={{background:'#FAF5EB',borderColor:'#DDD0B0'}}>
            {ytData.thumbnailUrl && <img src={ytData.thumbnailUrl} alt="" className="w-20 h-14 object-cover rounded"/>}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate" style={{color:'#14120E'}}>{ytData.title}</p>
              <p className="text-xs mt-0.5" style={{color:'#8C7A50'}}>{ytData.channelName}</p>
              <div className="flex gap-3 mt-1 text-xs font-semibold" style={{color:'#B48C28'}}>
                <span>👁 {ytData.views?.toLocaleString()}</span>
                <span>👍 {ytData.likes?.toLocaleString()}</span>
                <span>💬 {ytData.comments?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className={labelCls} style={labelStyle}>Video Title *</label>
          <input type="text" className={inputCls} style={inputStyle} placeholder="Enter or auto-filled from YouTube" value={form.videoTitle} onChange={e=>set('videoTitle',e.target.value)}/>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls} style={labelStyle}>Category *</label>
            <select className={inputCls} style={inputStyle} value={form.category} onChange={e=>set('category',e.target.value)}>
              {CATEGORIES.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} style={labelStyle}>Your Role *</label>
            <select className={inputCls} style={inputStyle} value={form.contributionRole} onChange={e=>set('contributionRole',e.target.value)}>
              {ROLES.map(r=><option key={r}>{r.replace('_',' ')}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls} style={labelStyle}>Remarks</label>
          <textarea className={inputCls} style={inputStyle} rows={2} placeholder="Optional notes..." value={form.remarks} onChange={e=>set('remarks',e.target.value)}/>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={submit} disabled={saving} className="px-6 py-2.5 rounded-lg font-semibold text-sm" style={{background:'#B48C28',color:'#fff',opacity:saving?0.6:1}}>
            {saving?'Submitting...':'Submit Entry'}
          </button>
          <button onClick={()=>{setForm(p=>({...p,videoTitle:'',youtubeUrl:'',remarks:''}));setYtData(null);setMsg(null)}} className="px-6 py-2.5 rounded-lg font-semibold text-sm border" style={{borderColor:'#DDD0B0',color:'#5C4D2A'}}>Clear</button>
        </div>

        {msg && (
          <div className="px-4 py-3 rounded-lg text-sm font-medium" style={{background:msg.ok?'#E8F5EE':'#FFF0F0',color:msg.ok?'#2D6A4F':'#78141E'}}>
            {msg.text}
          </div>
        )}
      </div>
    </div>
  )
}
