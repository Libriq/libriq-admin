type WhiteButtonProps = 
  | { label: string; href: string; onClick?: never; }
  | { label: string; onClick: () => void | Promise<void>; href?: never; }

const WhiteButton: React.FC<WhiteButtonProps> = (props) => {
  const baseClass = 'cursor-pointer w-fit bg-transparent backdrop-blur-lg border border-white text-white my-2 font-sans font-semibold rounded-md py-2 px-8 hover:text-gray-800 hover:bg-white text-center flex items-center justify-center';

  if ("href" in props) 
    return <a href={props.href} className={baseClass}>{props.label}</a>;

  return (
    <button onClick={props.onClick} type="button" className={baseClass}>
      {props.label}
    </button>
  );
}

export default WhiteButton;
