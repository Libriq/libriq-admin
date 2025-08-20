# Libriq Admin

Admin web app for **Libriq** — a university library alerting system. Admins can sign in, draft announcements, and send push notifications to student apps. Built with **Astro (TypeScript)** + **React islands**, **TailwindCSS v4**, and **Firebase** (Auth, Realtime Database, Hosting, Cloud Functions).

---

## Demo

* **Live demo**: [Libriq Admin Demo](https://libriq-admin.web.app)
* **Credentials**: Contact me for a full demo with credentials

## Features

* **Astro + React islands** UI
* **Tailwind v4** styling via `@tailwindcss/vite` (no config files needed)
* **Firebase Auth** (email/SSO-ready) with **custom claims** for roles
* **Realtime Database (RTDB)** for settings & alerts
* **Cloud Functions** for privileged actions (e.g., `sendAlert` to FCM topic)
* **i18n-ready** routing (e.g., `/en/...`, `/fr/...`)

---

## Prerequisites

* **Node.js** 18+ (Node 20 recommended)
* **Firebase CLI**: `npm i -g firebase-tools`
* A **Firebase project** with:

  * A **Web App** (\</>),
  * **Realtime Database** created,
  * **Hosting** enabled,
  * (**Later**) Cloud Messaging for device push.

---

## Getting Started

### 1) Install & run

```bash
# clone this repo
npm install
npm run dev
```

Visit the local URL printed by Astro.

### 2) Environment variables

Create a `.env` file in the project root:

```
PUBLIC_FB_API_KEY=...
PUBLIC_FB_AUTH_DOMAIN=...
PUBLIC_FB_DB_URL=https://<your-db>.firebasedatabase.app
PUBLIC_FB_PROJECT_ID=...
PUBLIC_FB_APP_ID=...
# optional
PUBLIC_FB_MESSAGING_SENDER_ID=...
PUBLIC_FB_MEASUREMENT_ID=...
```

**Where to find these:** Firebase Console → **Project settings → General → Your apps (Web)** → *SDK setup & configuration*.
`PUBLIC_FB_DB_URL` appears after you create Realtime Database: **Build → Realtime Database → Data**.

> In Astro, only env vars prefixed with `PUBLIC_` are exposed to the browser.

### 3) Point this repo to your Firebase project

```bash
firebase login
firebase use --add   # pick your existing project and give it an alias (e.g., prod)
```

---

## Project Structure

```
src/
  components/
    NavBar.tsx
    NavButton.tsx
  islands/
    AdminApp.tsx
    RequireAuth.tsx (optional)
  layouts/
    BaseLayout.astro
  pages/
    en/
      home/index.astro
      ...
    login.astro
  lib/
    firebase.client.ts
    useAuth.ts (optional hook)
  styles/
    global.css
functions/
  src/index.ts  (Cloud Functions)
firebase.json
.database.rules.json
.env.example
```

---

## Firebase pieces

### Auth (client)

Initialize once on the client and subscribe to auth state changes.

```ts
// src/lib/firebase.client.ts
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFunctions } from 'firebase/functions';

let app: FirebaseApp | undefined;
export function getFb() {
  if (!app) {
    app = initializeApp({
      apiKey: import.meta.env.PUBLIC_FB_API_KEY,
      authDomain: import.meta.env.PUBLIC_FB_AUTH_DOMAIN,
      databaseURL: import.meta.env.PUBLIC_FB_DB_URL,
      projectId: import.meta.env.PUBLIC_FB_PROJECT_ID,
      appId: import.meta.env.PUBLIC_FB_APP_ID,
    });
    setPersistence(getAuth(app), browserLocalPersistence);
  }
  return { app, auth: getAuth(app), db: getDatabase(app), fun: getFunctions(app) };
}
```

Minimal check in a React island:

```tsx
// src/lib/useAuth.ts
import { useEffect, useState } from 'react';
import { getFb } from './firebase.client';
import { onAuthStateChanged, type User } from 'firebase/auth';

export function useAuth() {
  const { auth } = getFb();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  useEffect(() => onAuthStateChanged(auth, setUser), [auth]);
  return { user, loading: user === undefined };
}
```

### Roles (custom claims)

Set once with the Admin SDK (script or locked-down function):

```ts
await admin.auth().setCustomUserClaims(uid, { role: 'admin', universityId: 'dal' });
```

Clients can read claims via `getIdTokenResult(user, true)`.

### Realtime Database (schema idea)

```
/universities/{univId}/settings { name, colors, logoUrl, ... }
/universities/{univId}/alerts/{alertId} { title, body, status, createdAt, createdBy }
/users/{uid}/deviceTokens/{token}: true   # optional audit/targeting
```

### RTDB Security Rules

`database.rules.json`:

```json
{
  "rules": {
    ".read": false,
    ".write": false,
    "universities": {
      "$univId": {
        "settings": {
          ".read": true,
          ".write": "auth != null && auth.token.role === 'admin' && auth.token.universityId === $univId"
        },
        "alerts": {
          ".indexOn": ["createdAt", "status"],
          "$alertId": {
            ".read": true,
            ".write": "auth != null && auth.token.role === 'admin' && auth.token.universityId === $univId"
          }
        }
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

Deploy rules:

```bash
firebase deploy --only database
```

### Cloud Functions (privileged actions)

`functions/src/index.ts` sample for sending topic alerts:

```ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

export const sendAlert = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Sign in required.');
  const role = context.auth.token.role as string | undefined;
  const universityId = context.auth.token.universityId as string | undefined;
  if (role !== 'admin' || !universityId) throw new functions.https.HttpsError('permission-denied', 'Admin only.');

  const { title, body, data: extra } = data ?? {};
  if (!title || !body) throw new functions.https.HttpsError('invalid-argument', 'title/body required.');

  const id = await admin.messaging().send({
    notification: { title, body },
    data: { ...extra, universityId },
    topic: `univ_${universityId}`
  });

  await admin.database().ref(`universities/${universityId}/alerts`).push({
    title, body, status: 'sent', sentAt: Date.now(), sentBy: context.auth.uid
  });

  return { id };
});
```

Deploy functions:

```bash
cd functions && npm i && cd ..
firebase deploy --only functions
```

---

## TailwindCSS v4

This project uses **Tailwind v4** via the Vite plugin (no `tailwind.config.*`).

**astro.config.mjs**

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],
  vite: { plugins: [tailwindcss()] }
});
```

**src/styles/global.css**

```css
@import "tailwindcss";

/* Optional project tokens (Tailwind v4) */
@theme {
  --color-background: #F7F7F8;
  --color-foreground: #111111;
  --color-brand: #3A7AFE;
}

@plugin "@tailwindcss/forms";
@plugin "@tailwindcss/typography";
```

Install optional plugins:

```bash
npm i -D @tailwindcss/forms @tailwindcss/typography
```

Import once in your base layout:

```astro
---
import "../styles/global.css";
---
```

> If you prefer the classic Tailwind setup with `tailwind.config.mjs`, you can switch to `npx astro add tailwind` and remove the Vite plugin.

---

## i18n routing

* Pages are organized under language folders: `src/pages/en/...`, `src/pages/fr/...`.
* A helper like `getLangFromUrl(Astro.url)` can derive the language segment.
* You can add Hosting redirects for convenience (e.g., `/en` → `/en/home/`).

**firebase.json**

```json
{
  "hosting": {
    "public": "dist",
    "predeploy": ["npm run build"],
    "redirects": [
      { "source": "/en",  "destination": "/en/home/", "type": 301 },
      { "source": "/en/", "destination": "/en/home/", "type": 301 }
    ]
  }
}
```

---

## Deployment

### One-time setup

* Ensure `firebase.json` uses `"public": "dist"`.
* Ensure scripts in `package.json`:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "deploy": "firebase deploy"
  }
}
```

### Deploy

```bash
npm run build
firebase deploy --only hosting
```

Preview channels (temporary URLs):

```bash
firebase hosting:channel:deploy staging
```

---

## Troubleshooting

* **Seeing the Firebase starter page** → `firebase.json` likely points to `public/`. Use `"public": "dist"` and redeploy.
* **Tailwind styles not applying** → Import `src/styles/global.css` in a layout; restart dev server.
* **Auth appears as logged-out briefly** → Seed state from `auth.currentUser` and subscribe with `onAuthStateChanged`.
* **RTDB `PERMISSION_DENIED`** → Ensure your user has claims `{ role: 'admin', universityId: '<id>' }` and rules deployed.
* **Callable function `unauthenticated`** → You must be signed in; the client SDK passes the ID token automatically.

---

## Scripts

* `npm run dev` — start dev server
* `npm run build` — build for production (outputs to `dist/`)
* `npm run preview` — preview the prod build
* `firebase deploy --only hosting|functions|database` — deploy pieces

---

## Notes

* Firebase web config keys (apiKey, authDomain, etc.) are **not secrets**. Access is enforced by Security Rules and Functions auth checks.
* Do **not** commit service account JSON or `.env` files. Use `.env.example` to share variable names.

---

## Roadmap (ideas)

* Admin user management (set roles via UI)
* Draft/schedule alerts; templates and targeting by topic
* Per-university runtime theming (load CSS variables from RTDB)
* Analytics & delivery reports

