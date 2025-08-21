import { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface IProps {
  open?: boolean;
  children: React.ReactNode;
  title: string;
  id?: string;
}

const Collapsible: React.FC<IProps> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleFilterOpening = () => {
    setIsOpen((prev) => !prev);
  }

  return (
    <div key={props.id} className='w-full min-w-xl md:min-w-2xl lg:min-w-4xl'>
      <button className='w-full cursor-pointer' type="button" onClick={handleFilterOpening}>
        <div className="w-full p-3 border-b border-white flex flex-row justify-between">
          <h4 className="text-white text-left w-full text-3xl font-semibold font-sans">{props.title}</h4>
          {!isOpen ? (
            <ChevronDownIcon className='w-8 h-8 text-white' />
          ) : (
              <ChevronUpIcon className='w-8 h-8 text-white' />
            )}
        </div>
      </button>
      <div>
        <div>{isOpen && <div>{props.children}</div>}</div>
      </div>
    </div>
  )
}

export default Collapsible;
