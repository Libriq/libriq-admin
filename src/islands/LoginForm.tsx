import { useEffect, useState } from "react";
import { getLangFromUrl, useTranslations } from "../i18n/utils";
import { getFb } from "../lib/firebase.client";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

type LoginFormProps = {
  url: URL;
}

const LoginForm: React.FC<LoginFormProps> = ({ url }) => {
  const { auth } = getFb();
  const [error, setError] = useState<string | null>(null); 
  const lang = getLangFromUrl(url);
  const t = useTranslations(lang);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (u) window.location.href = `/${lang}/dashboard/`;
    });
  }, [auth]);

  const emailPass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const f = e.currentTarget as any;
    try {
      await signInWithEmailAndPassword(auth, f.email.value, f.password.value);
    } catch (err: any) {
      setError(err.message ?? "Sign-in failed");
    }
  };

  return (
    <div className='w-full flex flex-col mb-6'>
      {/* Form */}
      <form onSubmit={emailPass} className='space-y-2 flex flex-col w-sm items-center'>
        <input name="email" placeholder={t('login.email')} className='w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white' />
        <input name="password" type="password" placeholder={t('login.password')} className="w-full text-white py-2 mb-4 bg-transparent border-b border-gray-500 focus:outline-none focus:border-white" />
        <button className="w-fit bg-transparent border border-white text-white mt-2 font-semibold rounded-md py-2 px-8 hover:text-gray-800 hover:bg-white text-center flex items-center justify-center cursor-pointer" type="submit">{t('login.signin')}</button>
      </form>

      {/* Error Display */}
      {error && <p className='text-red-500 mb-4'>{error}</p>}
    </div> 
  )
}

export default LoginForm;
