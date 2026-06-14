import { createContext, useContext, useState, useCallback } from 'react';
import {
  INITIAL_USERS, INITIAL_VIDEOS, INITIAL_ACTIVITY,
  INITIAL_VIDEO_TYPES, extractVideoId, makeAvatar, todayISO
} from './data/store';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [videos, setVideos] = useState(INITIAL_VIDEOS);
  const [activityLog, setActivityLog] = useState(INITIAL_ACTIVITY);
  const [videoTypes, setVideoTypes] = useState(INITIAL_VIDEO_TYPES);
  const [apiConfig, setApiConfig] = useState({ ytKey: '', sheetId: '', sheetKey: '' });
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const addVideo = useCallback((entry, userName) => {
    const newV = {
      id: Date.now(),
      date: entry.date,
      producer: userName,
      title: entry.title || 'Untitled',
      link: entry.link,
      videoId: extractVideoId(entry.link) || '',
      type: entry.type,
      format: entry.format,
      views: 0,
      editor: entry.editor || '-',
      designer: entry.designer || '-',
    };
    setVideos(prev => [newV, ...prev]);
    setUsers(prev => prev.map(u =>
      u.name === userName ? { ...u, videos: u.videos + (parseInt(entry.count) || 1) } : u
    ));
    logActivity(userName, 'Entry Added');
    return newV;
  }, []);

  const logActivity = useCallback((userName, event, device = 'Web Browser') => {
    const user = INITIAL_USERS.find(u => u.name === userName) ||
                 { role: 'User' };
    setActivityLog(prev => [{
      id: Date.now(),
      time: new Date().toLocaleString('en-IN', { hour12: false }).replace(',', ''),
      user: userName,
      event,
      role: user.role,
      device,
      duration: event === 'Login' ? 'Active' : '-',
    }, ...prev]);
  }, []);

  const addUser = useCallback((data) => {
    const newU = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      role: data.profile,
      access: data.access,
      videos: 0,
      views: 0,
      avatar: makeAvatar(data.name),
      perms: data.perms,
      status: 'active',
    };
    setUsers(prev => [...prev, newU]);
    return newU;
  }, []);

  const updateUser = useCallback((id, data) => {
    setUsers(prev => prev.map(u => u.id === id ? {
      ...u, ...data, avatar: makeAvatar(data.name || u.name)
    } : u));
  }, []);

  const addVideoType = useCallback((type) => {
    setVideoTypes(prev => prev.includes(type) ? prev : [...prev, type]);
  }, []);

  const updateVideoViews = useCallback((videoId, views) => {
    setVideos(prev => prev.map(v => v.videoId === videoId ? { ...v, views } : v));
  }, []);

  return (
    <AppContext.Provider value={{
      users, videos, activityLog, videoTypes, apiConfig,
      setApiConfig, toast, showToast,
      addVideo, logActivity, addUser, updateUser,
      addVideoType, updateVideoViews,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
