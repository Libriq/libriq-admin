type AnchorButtonProps = {
  dest: string;
  title: string;
}

const AnchorButton: React.FC<AnchorButtonProps> = ({ dest, title}) => {
  return (
    <a 
      href={dest} 
      className='w-fit bg-transparent backdrop-blur-lg border border-white text-white my-2 font-sans font-semibold rounded-md py-2 px-8 hover:text-gray-800 hover:bg-white text-center flex items-center justify-center'
    >
      {title}
    </a>
  );
}

export default AnchorButton;
