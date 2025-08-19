type NavButtonProps = {
  dest: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
};

const NavButton: React.FC<NavButtonProps> = ({ dest, Icon, title }) => {
  return (
    <a
      href={dest}
      aria-label={title}
      title={title}
      className='inline-flex items-center justify-center transition-colors duration-200 ease-in-out mx-3'
    >
      <Icon
        className='w-10 h-10 mt-2 text-neutral-300 hover:text-white'
        aria-hidden='true'
      />
      <span className='sr-only'>{title}</span>
    </a>
  );
}

export default NavButton;
