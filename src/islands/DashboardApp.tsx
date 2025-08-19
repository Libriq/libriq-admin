import { useEffect, useState } from "react";
import { getFb } from "../lib/firebase.client";
import { onAuthStateChanged, signOut, getIdTokenResult } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { getLangFromUrl } from "../i18n/utils";

type DashboardAppProps = {
  url: URL;
}

const DashboardApp: React.FC<DashboardAppProps> = ({ url }) => {
  const { auth } = getFb();
  const lang = getLangFromUrl(url);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (!u) {
        window.location.href = `/${lang}/login/`;
        return;
      }
    });
  }, [auth]);

  return (
    <div className='w-full flex flex-col my-auto mx-auto'>
      <button className='ml-3 border px-2 py-1' onClick={() => signOut(auth)}>Sign out</button>
    </div>
  )
}

export default DashboardApp;
