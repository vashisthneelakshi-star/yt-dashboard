'use client'
import { useEffect, useState } from 'react'
import { Plus, Search, Edit, Key, Trash2 } from 'lucide-react'

const ROLES = ['ADMIN','INCHARGE','PRODUCER','VIDEO_EDITOR','GRAPHIC_DESIGNER']
const ROLE_COLOR: Record<string,string> = { ADMIN:'#78141E', INCHARGE:'#B48C28', PRODUCER:'#1A4D80', VIDEO_EDITOR:'#5C3480', GRAPHIC_DESIGNER:'#2D6A4F' }

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editUser, setEditUser] = useState<any>(null)
  const [resetUser, setResetUser] = useState<any>(null)
  const [msg, setMsg] = useState('')

  const load = () => {
    setLoading(true)
    fetch(`/api/users?search=${search}&limit=50`).then(r=>r.json()).then(d=>{setUsers(d.items||[]);setTotal(d.total||0);setLoading(false)})
  }
  useEffect(()=>{ load() },[search])

  const deleteUser = async (u:any) => {
    if (!confirm(`Delete ${u.name}? This cannot be undone.`)) return
    await fetch(`/api/users/${u.id}`,{method:'DELETE'})
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-lg font-bold" style={{color:'#14120E'}}>Team & Users</h2><p className="text-xs mt-0.5" style={{color:'#8C7A50'}}>{total} members</p></div>
        <button onClick={()=>setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold" style={{background:'#B48C28',color:'#fff'}}>
          <Plus className="w-4 h-4"/>Add Member
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'#8C7A50'}}/>
          <input className="w-full pl-9 pr-3 py-2 rounded-lg border text-sm" style={{background:'#FAF5EB',borderColor:'#DDD0B0'}} placeholder="Search name, username..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden" style={{borderColor:'#DDD0B0'}}>
        {loading ? <div className="h-40 flex items-center justify-center text-sm" style={{color:'#8C7A50'}}>Loading...</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{background:'#FAF5EB',borderBottom:'1.5px solid #DDD0B0'}}>
                <tr>{['#','Emp ID','Name','Username','Role','Status','Videos','Actions'].map(h=><th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{color:'#8C7A50'}}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {users.map((u,i)=>(
                  <tr key={u.id} className="border-b hover:bg-[#FAF5EB]" style={{borderColor:'#EBE1C8'}}>
                    <td className="px-4 py-3 text-xs" style={{color:'#8C7A50'}}>{i+1}</td>
                    <td className="px-4 py-3 text-xs" style={{color:'#5C4D2A'}}>{u.employeeId||'-'}</td>
                    <td className="px-4 py-3 font-semibold text-xs" style={{color:'#14120E'}}>{u.name}</td>
                    <td className="px-4 py-3 text-xs font-mono" style={{color:'#5C4D2A'}}>{u.username}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{background:`${ROLE_COLOR[u.role]}18`,color:ROLE_COLOR[u.role]}}>{u.role.replace('_',' ')}</span></td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{background:u.status==='ACTIVE'?'#E8F5EE':'#FFF0F0',color:u.status==='ACTIVE'?'#2D6A4F':'#78141E'}}>{u.status}</span></td>
                    <td className="px-4 py-3 text-xs font-bold" style={{color:'#B48C28'}}>{u.videoCount}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={()=>setEditUser(u)} className="p-1.5 rounded hover:bg-gray-100"><Edit className="w-3.5 h-3.5" style={{color:'#5C4D2A'}}/></button>
                        <button onClick={()=>setResetUser(u)} className="p-1.5 rounded hover:bg-gray-100"><Key className="w-3.5 h-3.5" style={{color:'#B48C28'}}/></button>
                        <button onClick={()=>deleteUser(u)} className="p-1.5 rounded hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" style={{color:'#78141E'}}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAdd && <AddUserModal onClose={()=>{setShowAdd(false);load()}} />}
      {editUser && <EditUserModal user={editUser} onClose={()=>{setEditUser(null);load()}} />}
      {resetUser && <ResetPasswordModal user={resetUser} onClose={()=>setResetUser(null)} />}
    </div>
  )
}

function AddUserModal({ onClose }: { onClose:()=>void }) {
  const [form, setForm] = useState({ employeeId:'', name:'', username:'', email:'', mobile:'', password:'', role:'PRODUCER', status:'ACTIVE', mustChangePassword:true })
  const [err, setErr] = useState(''), [loading, setLoading] = useState(false)
  const set = (k:string,v:any) => setForm(p=>({...p,[k]:v}))
  const submit = async () => {
    if(!form.name||!form.username||!form.password){setErr('Name, username, password required');return}
    setLoading(true)
    const res = await fetch('/api/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
    const d = await res.json()
    if(d.success) onClose()
    else { setErr(d.error||'Failed'); setLoading(false) }
  }
  const iStyle = {background:'#FAF5EB',borderColor:'#DDD0B0',color:'#14120E'}
  const lStyle = {color:'#5C4D2A'}
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border" style={{borderColor:'#DDD0B0'}}>
        <h3 className="font-bold text-base mb-5" style={{color:'#14120E'}}>Add Team Member</h3>
        {err && <div className="mb-3 p-3 rounded-lg text-xs font-medium" style={{background:'#FFF0F0',color:'#78141E'}}>{err}</div>}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-bold uppercase tracking-wider mb-1" style={lStyle}>Employee ID</label><input className="w-full px-3 py-2 rounded-lg border text-sm" style={iStyle} placeholder="EMP001" value={form.employeeId} onChange={e=>set('employeeId',e.target.value)}/></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider mb-1" style={lStyle}>Full Name *</label><input className="w-full px-3 py-2 rounded-lg border text-sm" style={iStyle} value={form.name} onChange={e=>set('name',e.target.value)}/></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-bold uppercase tracking-wider mb-1" style={lStyle}>Username *</label><input className="w-full px-3 py-2 rounded-lg border text-sm font-mono" style={iStyle} value={form.username} onChange={e=>set('username',e.target.value)}/></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider mb-1" style={lStyle}>Password *</label><input type="password" className="w-full px-3 py-2 rounded-lg border text-sm" style={iStyle} value={form.password} onChange={e=>set('password',e.target.value)}/></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-bold uppercase tracking-wider mb-1" style={lStyle}>Email</label><input type="email" className="w-full px-3 py-2 rounded-lg border text-sm" style={iStyle} value={form.email} onChange={e=>set('email',e.target.value)}/></div>
            <div><label className="block text-xs font-bold uppercase tracking-wider mb-1" style={lStyle}>Mobile</label><input className="w-full px-3 py-2 rounded-lg border text-sm" style={iStyle} value={form.mobile} onChange={e=>set('mobile',e.target.value)}/></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-bold uppercase tracking-wider mb-1" style={lStyle}>Role *</label>
              <select className="w-full px-3 py-2 rounded-lg border text-sm" style={iStyle} value={form.role} onChange={e=>set('role',e.target.value)}>
                {['ADMIN','INCHARGE','PRODUCER','VIDEO_EDITOR','GRAPHIC_DESIGNER'].map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-bold uppercase tracking-wider mb-1" style={lStyle}>Status</label>
              <select className="w-full px-3 py-2 rounded-lg border text-sm" style={iStyle} value={form.status} onChange={e=>set('status',e.target.value)}>
                <option>ACTIVE</option><option>INACTIVE</option>
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs cursor-pointer" style={{color:'#5C4D2A'}}>
            <input type="checkbox" checked={form.mustChangePassword} onChange={e=>set('mustChangePassword',e.target.checked)} className="rounded"/>
            Force password change on first login
          </label>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={submit} disabled={loading} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{background:'#B48C28',color:'#fff',opacity:loading?0.6:1}}>{loading?'Adding...':'Add Member'}</button>
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-semibold border" style={{borderColor:'#DDD0B0',color:'#5C4D2A'}}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function EditUserModal({ user, onClose }: { user:any; onClose:()=>void }) {
  const [form, setForm] = useState({ name:user.name, role:user.role, status:user.status, email:user.email||'', mobile:user.mobile||'' })
  const [loading, setLoading] = useState(false)
  const set = (k:string,v:string) => setForm(p=>({...p,[k]:v}))
  const submit = async () => {
    setLoading(true)
    await fetch(`/api/users/${user.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
    onClose()
  }
  const iStyle = {background:'#FAF5EB',borderColor:'#DDD0B0',color:'#14120E'}
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border" style={{borderColor:'#DDD0B0'}}>
        <h3 className="font-bold text-base mb-5" style={{color:'#14120E'}}>Edit: {user.name}</h3>
        <div className="space-y-3">
          <div><label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{color:'#5C4D2A'}}>Full Name</label><input className="w-full px-3 py-2 rounded-lg border text-sm" style={iStyle} value={form.name} onChange={e=>set('name',e.target.value)}/></div>
          <div><label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{color:'#5C4D2A'}}>Role</label>
            <select className="w-full px-3 py-2 rounded-lg border text-sm" style={iStyle} value={form.role} onChange={e=>set('role',e.target.value)}>
              {['ADMIN','INCHARGE','PRODUCER','VIDEO_EDITOR','GRAPHIC_DESIGNER'].map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
          <div><label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{color:'#5C4D2A'}}>Status</label>
            <select className="w-full px-3 py-2 rounded-lg border text-sm" style={iStyle} value={form.status} onChange={e=>set('status',e.target.value)}>
              <option>ACTIVE</option><option>INACTIVE</option><option>SUSPENDED</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={submit} disabled={loading} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{background:'#B48C28',color:'#fff'}}>{loading?'Saving...':'Save Changes'}</button>
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-semibold border" style={{borderColor:'#DDD0B0',color:'#5C4D2A'}}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function ResetPasswordModal({ user, onClose }: { user:any; onClose:()=>void }) {
  const [pw, setPw] = useState(''), [force, setForce] = useState(true), [loading, setLoading] = useState(false), [done, setDone] = useState(false)
  const submit = async () => {
    if(pw.length<6){return}
    setLoading(true)
    await fetch(`/api/users/${user.id}/password`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({newPassword:pw,forceChange:force})})
    setDone(true); setLoading(false)
  }
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border" style={{borderColor:'#DDD0B0'}}>
        <h3 className="font-bold text-base mb-2" style={{color:'#14120E'}}>Reset Password</h3>
        <p className="text-xs mb-4" style={{color:'#8C7A50'}}>For: <strong>{user.name}</strong> (@{user.username})</p>
        {done ? (
          <div className="p-3 rounded-lg text-sm font-medium mb-4" style={{background:'#E8F5EE',color:'#2D6A4F'}}>✓ Password reset successfully!</div>
        ) : (
          <div className="space-y-3">
            <div><label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{color:'#5C4D2A'}}>New Password *</label>
              <input type="password" className="w-full px-3 py-2 rounded-lg border text-sm" style={{background:'#FAF5EB',borderColor:'#DDD0B0',color:'#14120E'}} placeholder="Min 6 characters" value={pw} onChange={e=>setPw(e.target.value)}/>
            </div>
            <label className="flex items-center gap-2 text-xs cursor-pointer" style={{color:'#5C4D2A'}}>
              <input type="checkbox" checked={force} onChange={e=>setForce(e.target.checked)} className="rounded"/>
              Force password change on next login
            </label>
          </div>
        )}
        <div className="flex gap-3 mt-4">
          {!done && <button onClick={submit} disabled={loading||pw.length<6} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{background:'#B48C28',color:'#fff',opacity:(loading||pw.length<6)?0.6:1}}>{loading?'Resetting...':'Reset Password'}</button>}
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-semibold border" style={{borderColor:'#DDD0B0',color:'#5C4D2A'}}>{done?'Close':'Cancel'}</button>
        </div>
      </div>
    </div>
  )
}
