import { useEffect, useState } from "react";
import { useTranslations } from "../i18n/utils";
import { getFb } from "../lib/firebase.client";
import { onAuthStateChanged } from "firebase/auth";

import AnchorButton from "../components/AnchorButton";

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
        <AnchorButton dest={`/${lang}/login/`} title={t('login.signin')} />}

      {isSignedIn &&
        <AnchorButton dest={`/${lang}/dashboard/`} title={t('nav.dashboard')} />}

      <AnchorButton 
        dest={`mailto:${import.meta.env.PUBLIC_ADMIN_EMAIL}`} 
        title={t('home.contact.admin')} 
      />
    </div>
  )
}

export default HomeButtons;
