import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFunctions } from "firebase/functions";

let app: FirebaseApp | undefined;

const config = {
  apiKey: import.meta.env.PUBLIC_FB_API_KEY,
  authDomain: import.meta.env.PUBLIC_FB_AUTH_DOMAIN,
  databaseURL: import.meta.env.PUBLIC_FB_DB_URL,
  projectId: import.meta.env.PUBLIC_FB_PROJECT_ID,
  appId: import.meta.env.PUBLIC_FB_APP_ID,
};

export function getFb() {
  if (!app) {
    app = initializeApp(config);
    setPersistence(getAuth(app), browserLocalPersistence);
  }
  return {
    app,
    auth: getAuth(app),
    db: getDatabase(app),
    fun: getFunctions(app),
  };
}

