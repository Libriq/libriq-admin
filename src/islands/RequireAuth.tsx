import { useLoading, Grid } from "@agney/react-loading";
import { useAuth } from "../hooks/useAuth";
import { getLangFromUrl } from "../i18n/utils";

type RequireAuthProps = {
  children: React.ReactNode;
  url: URL;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children, url }) => {
  const { user, loading } = useAuth();
  const lang = getLangFromUrl(url);
  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <Grid width="100" color="white" />,
  });

  if (loading) return (
    <div className='w-full h-[80dvh] flex justify-center items-center'>
      <section {...containerProps}>
        {indicatorEl}
      </section>
    </div>
  );

  if (!user) {
    if (typeof window !== "undefined") window.location.href = `/${lang}/login`;
    return null;
  }
  return <>{children}</>
}

export default RequireAuth;
