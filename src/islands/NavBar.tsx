import { useEffect, useState } from "react";
import { useTranslations } from "../i18n/utils";
import { getFb } from "../lib/firebase.client";
import { onAuthStateChanged } from "firebase/auth";

import { HomeIcon, ComputerDesktopIcon, QuestionMarkCircleIcon, UserIcon } from "@heroicons/react/24/outline";
import NavButton from "../components/NavButton";
import LanguagePicker from "../components/LanguagePicker";

type NavBarProps = {
  lang: "en" | "fr";
  url: URL;
}

const NavBar: React.FC<NavBarProps> = ({ lang, url }) => {
  const t = useTranslations(lang);
  const { auth } = getFb();

  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    setIsSignedIn(!!auth.currentUser);

    const unsub = onAuthStateChanged(auth, (u) => setIsSignedIn(!!u));
    return unsub;
  }, [auth]);

  return (
    <header className='w-full p-4 justify-between flex flex-row max-w-screen items-center'>
      <h1 className='text-4xl text-white font-serif font-bold mx-4'>{t('app.name')}</h1>

      <nav className='mx-2 flex flex-row items-center'>
        <div>
        <NavButton 
          dest={`/${lang}/`} 
          Icon={HomeIcon}
          title={t('nav.home')} 
        /> 

        <NavButton
          dest={`/${lang}/dashboard/`}
          Icon={ComputerDesktopIcon}
          title={t('nav.dashboard')}
        />

        {isSignedIn && <NavButton
          dest={`/${lang}/account/`}
          Icon={UserIcon}
          title={t('nav.account')}
        />}

        <NavButton
          dest={`/${lang}/help/`}
          Icon={QuestionMarkCircleIcon}
          title={t('nav.help')}
        />
        </div>

        <LanguagePicker url={url} />
      </nav>
    </header>
  );
}

export default NavBar;
