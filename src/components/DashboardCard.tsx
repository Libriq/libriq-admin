import SpotlightCard from "./SpotlightCard";

type DashboardCardProps = {
  href: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  desc: string;
  color: `rgba(${number}, ${number}, ${number}, ${number})`;
}

const DashboardCard: React.FC<DashboardCardProps> = (props) => {
  return (
    <a href={props.href} className="block mb-6 break-inside-avoid drop-shadow-neutral-700 drop-shadow-sm hover:drop-shadow-xl">
      <SpotlightCard className='w-fit h-fit text-white group cursor-pointer' spotlightColor={props.color}>
        <props.Icon className='w-12 h-12 text-white mb-4' aria-hidden='true' />
        <h2 className='text-neutral-400 group-hover:text-white mb-1 text-2xl font-sans font-semibold'>{props.title}</h2>
        <p className="max-w-sm text-neutral-400 group-hover:text-white text-lg font-light font-sans">
          {props.desc}
        </p>
      </SpotlightCard>
    </a>
  );
}

export default DashboardCard;
