// ─── PERMISSIONS ───────────────────────────────────────────────
export const PERMS_LIST = [
  { key: 'view_dashboard',   label: 'View Dashboard' },
  { key: 'add_entry',        label: 'Add Entry' },
  { key: 'view_all_videos',  label: 'View All Videos' },
  { key: 'view_reports',     label: 'View Reports' },
  { key: 'download_report',  label: 'Download Reports' },
  { key: 'manage_users',     label: 'Manage Users' },
  { key: 'view_activity',    label: 'View Activity Log' },
  { key: 'edit_entry',       label: 'Edit Entries' },
];

export const DEFAULT_PERMS = {
  admin:    PERMS_LIST.map(p => p.key),
  incharge: ['view_dashboard','add_entry','view_all_videos','view_reports','download_report','view_activity'],
  user:     ['view_dashboard','add_entry'],
};

// ─── USERS ─────────────────────────────────────────────────────
export const INITIAL_USERS = [
  { id:1, name:'Rahul Sharma',  email:'rahul@patrika.com',  role:'Producer',        access:'user',     videos:68, views:890000,  avatar:'RS', perms:DEFAULT_PERMS.user,     status:'active' },
  { id:2, name:'Priya Singh',   email:'priya@patrika.com',  role:'Video Editor',    access:'user',     videos:72, views:1100000, avatar:'PS', perms:DEFAULT_PERMS.user,     status:'active' },
  { id:3, name:'Amit Verma',    email:'amit@patrika.com',   role:'Producer',        access:'user',     videos:45, views:520000,  avatar:'AV', perms:DEFAULT_PERMS.user,     status:'active' },
  { id:4, name:'Neha Gupta',    email:'neha@patrika.com',   role:'Graphic Designer',access:'user',     videos:39, views:310000,  avatar:'NG', perms:DEFAULT_PERMS.user,     status:'active' },
  { id:5, name:'Vikram Joshi',  email:'vikram@patrika.com', role:'Video Editor',    access:'user',     videos:81, views:1350000, avatar:'VJ', perms:DEFAULT_PERMS.user,     status:'active' },
  { id:6, name:'Anjali Mehta',  email:'anjali@patrika.com', role:'Incharge',        access:'incharge', videos:55, views:670000,  avatar:'AM', perms:DEFAULT_PERMS.incharge, status:'active' },
  { id:7, name:'Rohit Kumar',   email:'rohit@patrika.com',  role:'Graphic Designer',access:'user',     videos:28, views:180000,  avatar:'RK', perms:DEFAULT_PERMS.user,     status:'active' },
  { id:8, name:'Kavita Patel',  email:'kavita@patrika.com', role:'Video Editor',    access:'user',     videos:60, views:780000,  avatar:'KP', perms:DEFAULT_PERMS.user,     status:'active' },
];

// ─── VIDEOS ────────────────────────────────────────────────────
export const INITIAL_VIDEOS = [
  { id:1, date:'2025-06-12', producer:'Rahul Sharma', title:'Election Special Byte',   link:'https://youtu.be/dQw4w9WgXcQ', videoId:'dQw4w9WgXcQ', type:'Byte', format:'Short', views:45200,  editor:'Priya Singh',  designer:'Neha Gupta'  },
  { id:2, date:'2025-06-12', producer:'Amit Verma',   title:'Cricket Match VO',        link:'https://youtu.be/jNQXAC9IVRw', videoId:'jNQXAC9IVRw', type:'VO',   format:'Short', views:32100,  editor:'Vikram Joshi', designer:'Neha Gupta'  },
  { id:3, date:'2025-06-11', producer:'Rahul Sharma', title:'AI News Explainer',       link:'https://youtu.be/QH2-TGUlwu4', videoId:'QH2-TGUlwu4', type:'AI',   format:'Long',  views:128000, editor:'Priya Singh',  designer:'Rohit Kumar' },
  { id:4, date:'2025-06-10', producer:'Anjali Mehta', title:'Weather Byte',            link:'https://youtu.be/kffacxfA7G4', videoId:'kffacxfA7G4', type:'Byte', format:'Short', views:18900,  editor:'Kavita Patel', designer:'Neha Gupta'  },
  { id:5, date:'2025-06-09', producer:'Vikram Joshi', title:'Budget Analysis Long',    link:'https://youtu.be/9bZkp7q19f0', videoId:'9bZkp7q19f0', type:'VO',   format:'Long',  views:89000,  editor:'Kavita Patel', designer:'Rohit Kumar' },
  { id:6, date:'2025-06-09', producer:'Rahul Sharma', title:'Sports Update',           link:'https://youtu.be/kffacxfA7G4', videoId:'kffacxfA7G4', type:'Byte', format:'Short', views:56700,  editor:'Priya Singh',  designer:'Rohit Kumar' },
];

// ─── ACTIVITY LOG ──────────────────────────────────────────────
export const INITIAL_ACTIVITY = [
  { id:1,  time:'2025-06-12 09:14', user:'Rahul Sharma',  event:'Login',       role:'Producer',        device:'Chrome / Windows', duration:'4h 20m' },
  { id:2,  time:'2025-06-12 09:31', user:'Priya Singh',   event:'Login',       role:'Video Editor',    device:'Chrome / Mac',     duration:'6h 10m' },
  { id:3,  time:'2025-06-12 10:02', user:'Amit Verma',    event:'Entry Added', role:'Producer',        device:'Firefox / Windows',duration:'-'      },
  { id:4,  time:'2025-06-12 11:15', user:'Vikram Joshi',  event:'Login',       role:'Video Editor',    device:'Safari / iOS',     duration:'2h 45m' },
  { id:5,  time:'2025-06-12 13:30', user:'Rahul Sharma',  event:'Entry Added', role:'Producer',        device:'Chrome / Windows', duration:'-'      },
  { id:6,  time:'2025-06-11 08:55', user:'Neha Gupta',    event:'Login',       role:'Graphic Designer',device:'Chrome / Windows', duration:'5h 00m' },
  { id:7,  time:'2025-06-11 09:10', user:'Anjali Mehta',  event:'Login',       role:'Incharge',        device:'Chrome / Windows', duration:'7h 15m' },
  { id:8,  time:'2025-06-11 14:00', user:'Rohit Kumar',   event:'No Activity', role:'Graphic Designer',device:'-',               duration:'-'      },
  { id:9,  time:'2025-06-11 09:45', user:'Kavita Patel',  event:'Entry Added', role:'Video Editor',    device:'Chrome / Windows', duration:'-'      },
  { id:10, time:'2025-06-10 09:00', user:'Rahul Sharma',  event:'Login',       role:'Producer',        device:'Chrome / Windows', duration:'5h 30m' },
];

// ─── VIDEO TYPES ───────────────────────────────────────────────
export const INITIAL_VIDEO_TYPES = ['Byte', 'VO', 'AI', 'Other'];

// ─── UTILS ─────────────────────────────────────────────────────
export function fmtViews(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

export function extractVideoId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|[?&]v=)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function makeAvatar(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export function downloadCSV(rows, filename) {
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}
