# YT Studio Pro — Patrika Group

Production YouTube Team Dashboard built with Next.js 15, NextAuth, Prisma, PostgreSQL (Neon).

---

## STEP 1 — Database Setup (Neon)

1. Go to **neon.tech** → Create account → New Project → "yt-studio-pro"
2. Copy the **Connection String** (looks like `postgresql://user:pass@host/db?sslmode=require`)
3. Save it — you'll need it below

---

## STEP 2 — YouTube API Key

1. Go to **console.cloud.google.com**
2. New Project → "YT Studio Pro"
3. APIs & Services → Library → Search **YouTube Data API v3** → Enable
4. Credentials → Create Credentials → API Key → Copy it

---

## STEP 3 — GitHub Upload

```bash
cd yt-studio-pro
git init
git add .
git commit -m "YT Studio Pro - production build"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/yt-studio-pro.git
git push -u origin main
```

---

## STEP 4 — Vercel Deploy

1. Go to **vercel.com** → New Project → Import your GitHub repo
2. Framework: **Next.js** (auto-detected)
3. Add Environment Variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Neon connection string |
| `NEXTAUTH_SECRET` | Run: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your Vercel URL e.g. `https://yt-studio.vercel.app` |
| `YOUTUBE_API_KEY` | Your YouTube API key |
| `CRON_SECRET` | Any random string |

4. Click **Deploy**

---

## STEP 5 — Setup Database

After first deploy, run in Vercel terminal or locally:

```bash
# Install deps
npm install

# Setup .env.local with your DATABASE_URL
cp .env.example .env.local
# Edit .env.local with real values

# Push schema to Neon
npm run db:push

# Create admin user (only runs once)
npm run db:seed
```

**Default Admin Login:**
- Username: `admin`
- Password: `Admin@123`
- ⚠️ You'll be forced to change password on first login

---

## STEP 6 — Add YouTube API in Dashboard

1. Login as admin
2. Go to **Settings** → Paste YouTube API Key → Save
3. Now video entries will auto-fetch title, views, likes, comments

---

## Features

| Feature | Status |
|---------|--------|
| Real database login (no hardcoded) | ✅ |
| Role-based access (Admin/Incharge/User) | ✅ |
| Add/Edit/Delete users with username+password | ✅ |
| Force password change on first login | ✅ |
| Change password / Admin reset password | ✅ |
| Bulk user upload (Excel + CSV) | ✅ |
| Download sample template | ✅ |
| Video entry with YouTube auto-fetch | ✅ |
| Real-time views (YouTube API) | ✅ |
| Hourly cron sync (Vercel Cron) | ✅ |
| Settings: Clear videos/users/logs/factory reset | ✅ |
| Activity log | ✅ |
| Royal cream/gold/maroon theme | ✅ |
| No demo data | ✅ |

---

## Cron Job

Vercel automatically runs `/api/cron/youtube-sync` every hour to update views, likes, comments for all videos.

The `vercel.json` file configures this — no extra setup needed.
