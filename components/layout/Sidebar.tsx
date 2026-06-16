'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, Video, FilePlus, BarChart3, Users, Upload, Settings, User, LogOut } from 'lucide-react'

const NAV = [
  { href:'/dashboard',   label:'Dashboard',   icon:LayoutDashboard, roles:['ADMIN','INCHARGE','PRODUCER','VIDEO_EDITOR','GRAPHIC_DESIGNER'] },
  { href:'/videos',      label:'Video Log',   icon:Video,           roles:['ADMIN','INCHARGE','PRODUCER','VIDEO_EDITOR','GRAPHIC_DESIGNER'] },
  { href:'/entry',       label:'Add Entry',   icon:FilePlus,        roles:['ADMIN','INCHARGE','PRODUCER','VIDEO_EDITOR','GRAPHIC_DESIGNER'] },
  { href:'/reports',     label:'Reports',     icon:BarChart3,       roles:['ADMIN','INCHARGE'] },
  { href:'/users',       label:'Team & Users',icon:Users,           roles:['ADMIN'] },
  { href:'/team-upload', label:'Bulk Upload', icon:Upload,          roles:['ADMIN'] },
  { href:'/settings',    label:'Settings',    icon:Settings,        roles:['ADMIN'] },
  { href:'/profile',     label:'My Profile',  icon:User,            roles:['ADMIN','INCHARGE','PRODUCER','VIDEO_EDITOR','GRAPHIC_DESIGNER'] },
]

export default function Sidebar({ user }: { user: { name:string; role:string; username:string } }) {
  const pathname = usePathname()
  const items = NAV.filter(n => n.roles.includes(user.role))
  const initials = user.name.split(' ').map((w:string)=>w[0]).join('').slice(0,2).toUpperCase()

  return (
    <div className="w-[220px] flex-shrink-0 flex flex-col h-full overflow-y-auto" style={{background:'#120E08',borderRight:'1px solid rgba(212,172,74,.12)'}}>
      {/* Logo */}
      <div className="px-4 py-5" style={{borderBottom:'1px solid rgba(212,172,74,.12)'}}>
        <div className="text-lg mb-0.5" >📺</div>
        <div className="text-sm font-bold" style={{color:'#E8C96A',letterSpacing:'.3px'}}>YT Studio Pro</div>
        <div className="text-[9px] uppercase tracking-[2px]" style={{color:'rgba(212,172,74,.35)'}}>Patrika Group</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2">
        <div className="text-[9px] uppercase tracking-[2px] px-2 mb-2 font-semibold" style={{color:'rgba(212,172,74,.3)'}}>Menu</div>
        {items.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href+'/')
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg mb-0.5 text-sm transition-all"
              style={{
                background: active ? 'rgba(212,172,74,.12)' : 'transparent',
                color: active ? '#E8C96A' : 'rgba(255,247,220,.4)',
                borderLeft: `2px solid ${active ? '#C8A032' : 'transparent'}`,
                fontWeight: active ? 600 : 400,
              }}>
              <Icon className="w-4 h-4 flex-shrink-0"/>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-3" style={{borderTop:'1px solid rgba(212,172,74,.12)'}}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{background:'rgba(212,172,74,.2)',border:'1px solid rgba(212,172,74,.3)',color:'#E8C96A'}}>
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold truncate" style={{color:'#E8C96A'}}>{user.name}</div>
            <div className="text-[10px] uppercase tracking-wider" style={{color:'rgba(212,172,74,.4)'}}>{user.role.replace('_',' ')}</div>
          </div>
        </div>
        <button onClick={()=>signOut({callbackUrl:'/login'})}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all"
          style={{color:'rgba(255,150,140,.5)'}}
          onMouseEnter={e=>{(e.target as any).style.background='rgba(169,50,38,.15)';(e.target as any).style.color='rgba(255,150,140,.8)'}}
          onMouseLeave={e=>{(e.target as any).style.background='transparent';(e.target as any).style.color='rgba(255,150,140,.5)'}}>
          <LogOut className="w-3.5 h-3.5"/>Sign Out
        </button>
      </div>
    </div>
  )
}
