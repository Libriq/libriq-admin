import { useState, useEffect } from "react";
import { useLoading, BallTriangle } from "@agney/react-loading";
import { useDB } from "../hooks/useDb";
import { getAllAnnouncements, type Announcement } from "../db/announcements";
import { useTranslations } from "../i18n/utils";

import AnimatedList from "../components/AnimatedList";
import Collapsible from "../components/Collapsible";

const dayFmt = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "long", year: "numeric" });
const monthFmt = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" });

function millis(v: unknown): number {
  return typeof v === "number" && isFinite(v) && v > 0 ? v : 0;
}

function monthKey(ms: number): string {
  if (!ms) return "pending";
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string): string {
  if (key === "pending") return "Pending";
  const [y, m] = key.split("-").map(Number);
  return monthFmt.format(new Date(y, m - 1, 1));
}

function formatDate(ms: unknown) {
  const n = millis(ms);
  return n ? dayFmt.format(new Date(n)) : "pending…";
}

interface PreviousAnnoucementListProps {
  lang: 'en' | 'fr';
}

const PreviousAnnouncementList: React.FC<PreviousAnnoucementListProps> = (props) => {
  const t = useTranslations(props.lang);
  const db = useDB();
  const [rows, setRows] = useState<Announcement[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <BallTriangle width="80" color="white" />,
  })

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await getAllAnnouncements(db);
        if (alive) setRows(list);
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Failed to load announcements.");
      }
    })();
    return () => { alive = false; };
  }, [db]);

  if (error) return <p className="text-red-400">{error}</p>;
  if (rows === null) return (
    <div className="w-full h-[40dvh] flex justify-center items-center">
      <section {...containerProps}>
        {indicatorEl}
      </section>
    </div>
  );
  if (rows.length === 0) return <p className="text-white/60 text-4xl mx-auto min-h-[60dvh]">{t('announcement-list.empty')}</p>;

  const sorted = [...rows].sort((a, b) => millis(b.createdAt) - millis(a.createdAt));

  const groups = new Map<string, Announcement[]>();
  for (const a of sorted) {
    const key = monthKey(millis(a.createdAt));
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(a);
  }

  const orderedKeys = [...groups.keys()]
  .filter(k => k !== "pending")
  .sort((a, b) => a.localeCompare(b))
  .reverse();
  if (groups.has("pending")) orderedKeys.push("pending");

  return (
    <div className='flex flex-col'>
      {orderedKeys.flatMap((key) => {
        return (
          <Collapsible title={monthLabel(key)} key={key} id={key}>
            <AnimatedList
              items={groups.get(key)!.map((a) => {
                return (
                  <div key={a.id} className="flex flex-col">
                    <div className="border-b border-white/10 pb-2">
                      <h3 className="text-xl font-semibold font-sans text-white">{a.title}</h3>
                    </div>
                    <div className="border-b border-white/10 py-4">
                      <p className="text-base font-light font-sans text-white">{a.shortDesc}</p>
                    </div>
                    <div className="pb-2 mt-4">
                      <div className="flex flex-row justify-between">
                        <p className="text-sm font-light font-sans text-white">{t('announcement-list.created')} {formatDate(a.createdAt)}</p>
                        <p className="text-sm font-light font-sans text-white">{t('announcement-list.created-by')} {a.createdBy || "unknown"}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              onItemSelect={(item, index) => console.log(item, index)}
              showGradients={false}
              enableArrowNavigation={true}
              displayScrollbar={true}
            />
          </Collapsible>
        );
      })}
    </div>
  );
};

export default PreviousAnnouncementList;
