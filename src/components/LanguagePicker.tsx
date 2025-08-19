import { languages } from "../i18n/ui";
import { getLangFromUrl, getRouteFromUrl } from "../i18n/utils";

type LanguagePickerProps = {
  url: URL;
};

const LanguagePicker: React.FC<LanguagePickerProps> = ({ url }) => {
  const route = getRouteFromUrl(url);
  const currLang = getLangFromUrl(url);

  const nextLang = currLang === "en" ? "fr" : "en";
  const href = `/${nextLang}${route === "/" ? "/" : route}`;

  return (
    <>
      <a href={href} lang={nextLang} className='text-neutral-300 text-3xl font-sans hover:text-white transition-colors duration-200 ease-in-out mx-3 inline-flex items-center justify-center'>
        {nextLang}
      </a>
    </>
  );
};

export default LanguagePicker;
