import { useLoading, ThreeDots } from "@agney/react-loading";
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";
import { createAnnouncement, type Announcement } from "../db/announcements";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useDB } from "../hooks/useDb";
import { useTranslations } from "../i18n/utils";

type NewAnnouncementFormProps = {
  lang: "en" | "fr";
}

const NewAnnouncementForm: React.FC<NewAnnouncementFormProps> = (props) => {
  const t = useTranslations(props.lang);
  const { user } = useAuth();
  const db = useDB();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [short, setShort] = useState<string>("");
  const MAX_SHORT_DESC_LENGTH = 150;

  const submitAnnouncement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    setSuccessId(null);

    const f = e.currentTarget as HTMLFormElement & {
      title: HTMLInputElement;
      shortDesc: HTMLInputElement;
      longDesc: HTMLInputElement;
      emergency: HTMLInputElement; // checkbox
    }

    if (!user?.email) {
      setSubmitting(false);
      setError(t('announcement.posting.error'));
      return;
    }

    const newAnnouncement: Omit<Announcement, "id" | "createdAt"> = {
      title: f.title.value.trim(),
      shortDesc: f.shortDesc.value.trim(),
      longDesc: f.longDesc.value.trim(),
      emergency: f.emergency.checked,
      createdBy: user.email,
    };

    try {
      // TODO: Add form validation before posting
      const id = await createAnnouncement(db, newAnnouncement);
      setSuccessId(id);
      f.reset();
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? t('announcement.create.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <ThreeDots width="50" color="white" />
  });

  return (
    <form onSubmit={submitAnnouncement}>
      <div className='my-10 grid grid-cols-1 gap-x-6 gap-y-8'>
        {/* Title */}
        <div>
          <label htmlFor='title' className='block text-2xl mb-2 font-medium font-sans text-white'>{t('announcement.title.label')}</label>
          <input 
            name='title' 
            placeholder={t('announcement.title.placeholder')} 
            required
            aria-required
            className='w-full text-white py-2 mb-4 bg-transparent border-b border-white/20 focus:outline-none focus:border-white'
          />
        </div>

        {/* Short Description */}
        <div className='col-span-full'>
          <label htmlFor='shortDesc' className='block text-2xl mb-2 font-medium font-sans text-white'>
            {t('announcement.short-desc.label')}
            <span className='ml-3 text-base font-sans font-light text-white/50'>
              {short.length} / {MAX_SHORT_DESC_LENGTH}
            </span>
          </label>
          <div className="mt-2">
            <textarea 
              id='shortDesc' 
              name='shortDesc' 
              placeholder={t('announcement.short-desc.placeholder')}
              required
              aria-required
              rows={2} 
              onChange={(e) => setShort(e.target.value)}
              maxLength={MAX_SHORT_DESC_LENGTH}
              className='block w-full py-2 mb-4 border-b text-white border-white/20 focus:outline-none focus:border-white placeholder-neutral-500'
            >
            </textarea>
          </div>
        </div>

        {/* Long Description */}
        <div className='col-span-full'>
          <label htmlFor='longDesc' className='block text-2xl mb-2 font-medium font-sans text-white'>{t('announcement.long-desc.label')}</label>
          <div className="mt-2">
            <textarea
              id='longDesc'
              name='longDesc'
              placeholder={t('announcement.long-desc.placeholder')}
              required
              aria-required
              rows={5}
              className='block w-full py-2 mb-4 border-b text-white border-white/20 focus:outline-none focus:border-white placeholder-neutral-500'
            ></textarea>
          </div>
        </div>

        {/* Urgency */}
        <div>
          <fieldset>
            <legend className="text-2xl font-semibold text-white">{t('announcement.urgency.legend')}</legend>
            <div>
              <div className="flex gap-3">
                <div className="flex h-6 shrink-0 items-center">
                  <div className="group grid size-4 grid-cols-1">
                    <input 
                      id="emergency"
                      type="checkbox" 
                      name="emergency" 
                      aria-describedby="emergency-description"
                      className="col-start-1 row-start-1 appearance-none rounded-sm border border-white/10 bg-white/5 checked:border-yellow-500 checked:bg-yellow-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:border-white/5 disabled:bg-white/10 disabled:checked:bg-white/10 forced-colors:appearance-auto"
                    />
                    <svg viewBox="0 0 14 14" fill="none" className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-white/25">
                      <path d="M3 8L6 11L11 3.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-has-checked:opacity-100" />
                      <path d="M3 7H11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-has-indeterminate:opacity-100" />
                    </svg>
                  </div>
                </div>
                <div className="text-base">
                  <label htmlFor='emergency' className='font-medium text-white flex flex-row items-center'>
                    <ExclamationTriangleIcon className='w-5 h-5' color="yellow" />
                    &nbsp;{t('announcement.emergency.label')}
                  </label>
                  <p className="text-white/50" id='emergency-description'>{t('announcement.emergency.description')}</p>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        {!submitting && 
          <button 
            className="mx-auto w-fit mt-2 bg-transparent border border-white text-white font-semibold rounded-md py-2 px-8 hover:text-gray-800 hover:bg-white text-center flex items-center justify-center cursor-pointer" 
            type="submit"
          >
            {t('announcement.submit-btn.label')}
          </button>
        }
        {submitting &&
          <div className='w-full h-fit flex justify-center'>
            <section {...containerProps}>
              {indicatorEl}
            </section>
          </div>
        }

        {/* Messages */}
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        {successId && <p className="text-green-400 text-sm mt-2">{t('announcement.created')} (id: {successId}).</p>}
      </div>
    </form>
  );
};

export default NewAnnouncementForm;
