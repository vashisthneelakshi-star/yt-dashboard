'use client'
import { usePathname } from 'next/navigation'
const TITLES: Record<string,string> = {
  '/dashboard':'Dashboard','/videos':'Video Log','/entry':'Add Entry',
  '/reports':'Reports','/users':'Team & Users','/team-upload':'Bulk Upload',
  '/settings':'Settings','/profile':'My Profile',
}
export default function Topbar({ user }: { user:{name:string;role:string} }) {
  const pathname = usePathname()
  const title = Object.entries(TITLES).find(([k])=>pathname===k||pathname.startsWith(k+'/'))?.[1]??'Dashboard'
  return (
    <div className="h-14 flex-shrink-0 flex items-center justify-between px-6 bg-white" style={{borderBottom:'1px solid #DDD0B0',boxShadow:'0 1px 4px rgba(0,0,0,.05)'}}>
      <h1 className="text-base font-semibold" style={{color:'#14120E'}}>{title}</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs" style={{color:'#8C7A50'}}>
          <span className="live-dot"/>Views Live
        </div>
        <div className="text-xs font-medium" style={{color:'#8C7A50'}}>
          {new Date().toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'})}
        </div>
      </div>
    </div>
  )
}
