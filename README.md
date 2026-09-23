# Task Manager

A full-stack task management application built with Next.js, React, NextAuth, and MongoDB. Users sign in, manage personal tasks, and use reminder and snooze controls from a dashboard.

## Features

- Credentials and Google sign-in through NextAuth.
- Password verification with bcrypt and JWT-based sessions.
- Task creation and task API routes, including snooze handling.
- Dashboard components for task history, alarms, notification controls, and sound settings.
- Light and dark interface themes.

## Local setup

Use Node.js compatible with Next.js 15, npm, a MongoDB database, and Google OAuth credentials for Google sign-in.

```bash
git clone https://github.com/jay2323-tech/taskmanager.git
cd taskmanager
npm ci
```

Create `.env.local` with your own values:

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=taskmanager
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-long-random-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Configure the Google OAuth callback for `/api/auth/callback/google` under your application origin. Do not commit credentials.

```bash
npm run dev
```

Open http://localhost:3000. MongoDB must be reachable for account and task operations.

## Source map

| Path | Responsibility |
| --- | --- |
| `app/api/auth/` | NextAuth handler |
| `app/api/register/` | Account registration |
| `app/api/tasks/` | Task and snooze routes |
| `lib/auth.js` | Providers, password checks, and session configuration |
| `lib/mongodb.js` | Shared MongoDB connection |
| `components/dashboard/` | Tasks, reminders, history, and sound controls |

## Build and check

```bash
npm run build
npm start
```

Verify registration, sign-in, task creation, updates, and snoozing with a test account. Use a second account to check task isolation. Browser notification and audio behavior depends on permission and browser restrictions; verify it on the target device. The package currently has no automated test script.
