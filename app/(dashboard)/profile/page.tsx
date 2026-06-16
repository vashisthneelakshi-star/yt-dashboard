'use client'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function ProfilePage() {
  const { data:session } = useSession()
  const user = session?.user as any
  const [form, setForm] = useState({ currentPassword:'', newPassword:'', confirm:'' })
  const [msg, setMsg] = useState<{text:string;ok:boolean}|null>(null), [loading, setLoading] = useState(false)

  const change = async () => {
    if(form.newPassword !== form.confirm){ setMsg({text:'Passwords do not match',ok:false}); return }
    if(form.newPassword.length<6){ setMsg({text:'Min 6 characters',ok:false}); return }
    setLoading(true)
    const res = await fetch(`/api/users/${user?.id}/password`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({currentPassword:form.currentPassword,newPassword:form.newPassword})})
    const d = await res.json()
    setMsg({text:d.success?'Password changed successfully!':d.error||'Failed',ok:d.success})
    if(d.success) setForm({currentPassword:'',newPassword:'',confirm:''})
    setLoading(false)
  }

  const iStyle = {background:'#FAF5EB',borderColor:'#DDD0B0',color:'#14120E'}
  return (
    <div className="max-w-lg">
      <div className="mb-6"><h2 className="text-lg font-bold" style={{color:'#14120E'}}>My Profile</h2></div>
      <div className="bg-white rounded-xl border p-6 mb-4" style={{borderColor:'#DDD0B0'}}>
        <h3 className="font-bold text-sm mb-4" style={{color:'#14120E'}}>Account Info</h3>
        <div className="space-y-2 text-sm">
          <div className="flex"><span className="w-28 text-xs font-bold uppercase tracking-wider" style={{color:'#8C7A50'}}>Name</span><span style={{color:'#14120E'}}>{user?.name}</span></div>
          <div className="flex"><span className="w-28 text-xs font-bold uppercase tracking-wider" style={{color:'#8C7A50'}}>Username</span><span className="font-mono" style={{color:'#14120E'}}>{user?.username}</span></div>
          <div className="flex"><span className="w-28 text-xs font-bold uppercase tracking-wider" style={{color:'#8C7A50'}}>Role</span><span style={{color:'#B48C28',fontWeight:600}}>{user?.role?.replace('_',' ')}</span></div>
        </div>
      </div>
      <div className="bg-white rounded-xl border p-6" style={{borderColor:'#DDD0B0'}}>
        <h3 className="font-bold text-sm mb-4" style={{color:'#14120E'}}>Change Password</h3>
        {msg && <div className="mb-3 p-3 rounded-lg text-xs font-medium" style={{background:msg.ok?'#E8F5EE':'#FFF0F0',color:msg.ok?'#2D6A4F':'#78141E'}}>{msg.text}</div>}
        <div className="space-y-3">
          {[['currentPassword','Current Password'],['newPassword','New Password'],['confirm','Confirm New Password']].map(([k,l])=>(
            <div key={k}><label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{color:'#5C4D2A'}}>{l}</label>
              <input type="password" className="w-full px-3 py-2.5 rounded-lg border text-sm" style={iStyle} value={(form as any)[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}/>
            </div>
          ))}
        </div>
        <button onClick={change} disabled={loading} className="mt-4 px-5 py-2.5 rounded-lg text-sm font-semibold" style={{background:'#B48C28',color:'#fff',opacity:loading?0.6:1}}>
          {loading?'Changing...':'Change Password'}
        </button>
      </div>
    </div>
  )
}
