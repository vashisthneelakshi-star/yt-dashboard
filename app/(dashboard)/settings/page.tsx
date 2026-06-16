'use client'
import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

function DangerAction({ title, description, buttonLabel, action, confirmText }: { title:string; description:string; buttonLabel:string; action:string; confirmText:string }) {
  const [loading, setLoading] = useState(false), [done, setDone] = useState('')
  const run = async () => {
    if (!confirm(confirmText)) return
    setLoading(true)
    const res = await fetch('/api/settings/reset',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action})})
    const d = await res.json()
    setDone(d.message||'Done'); setLoading(false)
  }
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border" style={{borderColor:'#DDD0B0'}}>
      <div>
        <div className="font-semibold text-sm" style={{color:'#14120E'}}>{title}</div>
        <div className="text-xs mt-0.5" style={{color:'#8C7A50'}}>{description}</div>
        {done && <div className="text-xs mt-1 font-medium" style={{color:'#2D6A4F'}}>✓ {done}</div>}
      </div>
      <button onClick={run} disabled={loading} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{background:'#78141E',color:'#fff',opacity:loading?0.6:1}}>
        {loading?'Processing...':buttonLabel}
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const [ytKey, setYtKey] = useState(''), [saving, setSaving] = useState(false), [saved, setSaved] = useState(false)
  const saveKey = async () => {
    setSaving(true)
    await fetch('/api/settings/youtube-key',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:ytKey})})
    setSaved(true); setSaving(false); setTimeout(()=>setSaved(false),3000)
  }
  return (
    <div className="max-w-2xl">
      <div className="mb-6"><h2 className="text-lg font-bold" style={{color:'#14120E'}}>Settings</h2></div>

      <div className="bg-white rounded-xl border p-6 mb-4" style={{borderColor:'#DDD0B0'}}>
        <h3 className="font-bold text-sm mb-4 pb-3 border-b" style={{color:'#14120E',borderColor:'#EBE1C8'}}>YouTube API Configuration</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{color:'#5C4D2A'}}>YouTube Data API v3 Key</label>
            <input className="w-full px-3 py-2.5 rounded-lg border text-sm font-mono" style={{background:'#FAF5EB',borderColor:'#DDD0B0'}} placeholder="AIzaSy..." value={ytKey} onChange={e=>setYtKey(e.target.value)}/>
          </div>
          <div className="p-3 rounded-lg text-xs" style={{background:'#FAF5EB',color:'#5C4D2A'}}>
            <strong>How to get:</strong> console.cloud.google.com → New Project → APIs & Services → YouTube Data API v3 → Enable → Credentials → Create API Key
          </div>
          <button onClick={saveKey} disabled={saving||!ytKey} className="px-5 py-2 rounded-lg text-sm font-semibold" style={{background:'#B48C28',color:'#fff',opacity:(saving||!ytKey)?0.6:1}}>
            {saving?'Saving...':saved?'✓ Saved!':'Save API Key'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6" style={{borderColor:'#DDD0B0'}}>
        <div className="flex items-center gap-2 mb-4 pb-3 border-b" style={{borderColor:'#EBE1C8'}}>
          <AlertTriangle className="w-4 h-4" style={{color:'#78141E'}}/>
          <h3 className="font-bold text-sm" style={{color:'#78141E'}}>Danger Zone</h3>
        </div>
        <div className="space-y-3">
          <DangerAction title="Clear All Videos" description="Remove all video entries and analytics data" buttonLabel="Clear Videos" action="clear_videos" confirmText="Are you sure? All video data will be permanently deleted."/>
          <DangerAction title="Clear Activity Logs" description="Remove all login and audit logs" buttonLabel="Clear Logs" action="clear_activity" confirmText="Clear all activity and audit logs?"/>
          <DangerAction title="Clear All Users" description="Remove all users except current admin" buttonLabel="Clear Users" action="clear_users" confirmText="Remove ALL users except you? They will lose access immediately."/>
          <DangerAction title="Factory Reset" description="Remove ALL data — users, videos, logs. Cannot be undone." buttonLabel="Factory Reset" action="factory_reset" confirmText="FACTORY RESET: This will delete everything except your admin account. Type OK to confirm." />
        </div>
      </div>
    </div>
  )
}
