# YT Studio Pro — Patrika Group

YouTube Team Dashboard — React + Vite app for tracking video production, views, and team performance.

## 🚀 Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

## 📦 Build

```bash
npm run build
```

## ☁️ Deploy on Vercel

### Option 1 — Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2 — GitHub + Vercel (Recommended)
1. GitHub pe push karo:
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/yt-dashboard.git
git push -u origin main
```
2. `vercel.com` → New Project → Import GitHub repo → Deploy ✅

## ⚙️ YouTube API Setup

1. `console.cloud.google.com` → New Project
2. APIs & Services → Library → **YouTube Data API v3** → Enable
3. Credentials → Create API Key → Copy
4. Dashboard mein top-right `⚙️ API Config` → paste karo → Save

## 📋 Features

- **Admin**: Full dashboard, team management, all reports, video log with filters
- **Incharge**: Dashboard, reports, video log, entry form  
- **User**: Personal performance, add entry
- **Live Views**: YouTube API se auto-fetch on page load & refresh button
- **Reports**: Daily/Weekly/Fortnightly/Monthly/Half-Yearly/Yearly — CSV download
- **Activity Log**: Login tracking, absent members, downloadable
- **User Management**: Add/edit members, custom permissions per user
- **Custom Video Types**: Add your own types beyond Byte/VO/AI/Other
- **Top/Worst Performers**: 5/10/15/20/25 — customizable, role-wise filter

## 📊 Google Sheets Integration (Future)

Google Apps Script se data sync karo:
- `Users` sheet → team members
- `Videos` sheet → all entries  
- `ActivityLog` sheet → login/logout

Script example: `File → Apps Script → doPost/doGet` for read-write from dashboard.
