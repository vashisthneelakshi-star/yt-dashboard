'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
export default function LoginPage() {
  const router = useRouter()
  const [u,setU]=useState(''), [p,setP]=useState(''), [show,setShow]=useState(false), [err,setErr]=useState(''), [load,setLoad]=useState(false)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if(!u||!p){setErr('Username aur password required');return}
    setLoad(true); setErr('')
    const res = await signIn('credentials',{username:u.trim(),password:p,redirect:false})
    if(res?.error){setErr('Invalid username or password');setLoad(false)}
    else{router.push('/dashboard');router.refresh()}
  }
  return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'linear-gradient(135deg,#120E08,#1E180E,#2A2010)'}}>
      <div className="w-[380px]">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">📺</div>
          <h1 className="text-xl font-bold" style={{color:'#E8C96A'}}>YT Studio Pro</h1>
          <p className="text-xs uppercase tracking-widest mt-1" style={{color:'#9A7B2F'}}>Patrika Group</p>
          <div className="mt-3 h-px w-12 mx-auto" style={{background:'linear-gradient(90deg,transparent,#B48C28,transparent)'}}/>
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-2xl border" style={{borderColor:'#DDD0B0'}}>
          <h2 className="text-base font-semibold mb-5" style={{color:'#14120E'}}>Sign In to Dashboard</h2>
          {err && <div className="mb-4 px-4 py-3 rounded-lg text-sm font-medium" style={{background:'#FFF0F0',color:'#78141E',border:'1px solid #F0C0C0'}}>{err}</div>}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{color:'#5C4D2A'}}>Username</label>
              <input className="w-full px-3 py-2.5 rounded-lg border text-sm transition-all" style={{background:'#FAF5EB',borderColor:'#DDD0B0',color:'#14120E'}} placeholder="Enter username" value={u} onChange={e=>setU(e.target.value)} autoFocus/>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{color:'#5C4D2A'}}>Password</label>
              <div className="relative">
                <input type={show?'text':'password'} className="w-full px-3 py-2.5 pr-10 rounded-lg border text-sm" style={{background:'#FAF5EB',borderColor:'#DDD0B0',color:'#14120E'}} placeholder="Enter password" value={p} onChange={e=>setP(e.target.value)}/>
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" style={{color:'#8C7A50'}} onClick={()=>setShow(s=>!s)}>{show?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}</button>
              </div>
            </div>
            <button type="submit" disabled={load} className="w-full py-2.5 rounded-lg font-semibold text-sm transition-colors mt-2" style={{background:'#B48C28',color:'#fff',opacity:load?.7:1}}>
              {load?'Signing in...':'Sign In →'}
            </button>
          </form>
          <p className="mt-5 text-center text-xs" style={{color:'#8C7A50'}}>Contact admin if you forgot your password</p>
        </div>
        <p className="text-center text-xs mt-6" style={{color:'#5A4A2A'}}>© {new Date().getFullYear()} Patrika Group</p>
      </div>
    </div>
  )
}
