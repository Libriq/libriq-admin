import { useEffect, useState } from "react";
import { useTranslations } from "../i18n/utils";
import { getFb } from "../lib/firebase.client";
import { onAuthStateChanged } from "firebase/auth";

import WhiteButton from "../components/WhiteButton";

type HomeButtonsProps = {
  lang: "en" | "fr";
}

const HomeButtons: React.FC<HomeButtonsProps> = ({ lang }) => {
  const t = useTranslations(lang);
  const { auth } = getFb();

  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    setIsSignedIn(!!auth.currentUser);

    const unsub = onAuthStateChanged(auth, (u) => setIsSignedIn(!!u));
    return unsub;
  }, [auth]);

  return (
    <div className='w-full mx-4 flex flex-row justify-between'>
      {!isSignedIn &&
        <WhiteButton label={t('login.signin')} onClick={() => { window.location.href = `/${lang}/login/`}} />}

      {isSignedIn && 
        <WhiteButton label={t('nav.dashboard')} onClick={() => { window.location.href = `/${lang}/dashboard/` }} />}

      <WhiteButton label={t('home.contact.admin')} href={`mailto:${import.meta.env.PUBLIC_ADMIN_EMAIL}`} />
    </div>
  )
}

export default HomeButtons;
