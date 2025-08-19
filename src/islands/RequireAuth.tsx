import { useAuth } from "../hooks/useAuth";
import { getLangFromUrl } from "../i18n/utils";

type RequireAuthProps = {
  children: React.ReactNode;
  url: URL;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children, url }) => {
  const { user, loading } = useAuth();
  const lang = getLangFromUrl(url);

  if (loading) return <p>Loading...</p>;
  if (!user) {
    if (typeof window !== "undefined") window.location.href = `/${lang}/login`;
    return null;
  }
  return <>{children}</>
}

export default RequireAuth;
