import { BellIcon, CalendarDaysIcon, ChartPieIcon, ListBulletIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "../i18n/utils";
import DashboardCard from "../components/DashboardCard";
import Clock from "../components/Clock";

type DashboardAppProps = {
  lang: "en" | "fr";
}

const DashboardApp: React.FC<DashboardAppProps> = (props) => {
  const t = useTranslations(props.lang);

  return (
    <div className='lg:max-w-4xl xl:max-w-7xl lg:w-full w-fit mx-auto columns-sm'>
      <DashboardCard 
        href={`/${props.lang}/dashboard/new-announcement/`} 
        Icon={BellIcon}
        title={t('dashboard.new-announcement.title')}
        desc={t('dashboard.new-announcement.desc')}
        color="rgba(0, 229, 255, 0.2)"
      />

      <Clock />

      <DashboardCard
        href={`/${props.lang}/dashboard/announcement-list/`}
        Icon={ListBulletIcon}
        title={t('dashboard.announcement-list.title')}
        desc={t('dashboard.announcement-list.desc')}
        color="rgba(203, 13, 111, 0.4)"
      />

      <DashboardCard
        href={`/${props.lang}/dashboard/statistics/`}
        Icon={ChartPieIcon}
        title={t('dashboard.stats.title')}
        desc={t('dashboard.stats.desc')}
        color="rgba(28, 125, 47, 0.4)"
      />

      <DashboardCard
        href={`/${props.lang}/dashboard/team/`}
        Icon={UserGroupIcon}
        title={t('dashboard.team.title')}
        desc={t('dashboard.team.desc')}
        color="rgba(239, 234, 22, 0.4)"
      />

      <DashboardCard
        href={`/${props.lang}/dashboard/calendar/`}
        Icon={CalendarDaysIcon}
        title={t('dashboard.calendar.title')}
        desc={t('dashboard.calendar.desc')}
        color="rgba(239, 144, 22, 0.4)"
      />
    </div>
  )
}

export default DashboardApp;
