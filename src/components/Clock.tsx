import { useEffect, useState } from "react";
import SpotlightCard from "./SpotlightCard";

const Clock = () => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    console.log(time);
  }, [time]);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const minuteHandAngle = minutes * 6 + seconds * 0.1; 
  const hourHandAngle = (hours % 12) * 30 + minutes * 0.5;

  return (
    <SpotlightCard className='w-full h-fit mb-6 drop-shadow-sm drop-shadow-gray-700' spotlightColor="rgba(147, 72, 217, 0.4)">
      <div id='Clock' className='mx-auto w-56 h-56 border border-white rounded-[50%] -rotate-90'>
        <div
          id="minutes"
          className="absolute top-1/2 left-1/2 origin-[0%_0%] w-2/5 h-[2px] bg-gray-400 transition-transform duration-500 ease-in-out"
          style={{ transform: `rotate(${minuteHandAngle}deg)` }}
        />
        <div
          id="hour"
          className="absolute top-1/2 drop-shadow-black drop-shadow-sm left-1/2 origin-[0%_0%] w-1/3 h-[2px] bg-white transition-transform duration-500 ease-in-out"
          style={{ transform: `rotate(${hourHandAngle}deg)` }}
        />
      </div>
    </SpotlightCard>
  );
}

export default Clock;
