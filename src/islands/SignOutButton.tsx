import { getFb } from "../lib/firebase.client";
import { signOut } from "firebase/auth";
import { useTranslations } from "../i18n/utils";
import WhiteButton from "../components/WhiteButton";

type SignOutButtonProps = {
  lang: "en" | "fr";
}

const SignOutButton: React.FC<SignOutButtonProps> = ({ lang }) => {
  const t = useTranslations(lang);
  const { auth } = getFb();
  const signOutHandler = () => signOut(auth);

  return <WhiteButton label={t('logout.signout')} onClick={() => signOutHandler()} />;
}

export default SignOutButton;
