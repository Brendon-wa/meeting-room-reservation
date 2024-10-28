import React from 'react';

interface TimeSelectorProps {
   selectedDate: Date | undefined;
   availableTimes: string[];
   getEndTimeData: (time: string) => void;
   selectedTime: string | undefined;
   setSelectedStartTime: (time: string) => void;
   setValue: (field: string, value: string) => void;
   placeholder: string;
   time: 'start' | 'end';
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
   selectedDate,
   availableTimes,
   getEndTimeData,
   selectedTime,
   setSelectedStartTime,
   setValue,
   placeholder,
   time,
}) => {
   const handleTimeClick = (item: string) => {
      if (time === 'start') {
         getEndTimeData(item);
      }
      setSelectedStartTime(item);
      setValue(`${time}_time`, item);
   };

   return (
      <div>
         {selectedDate && <span className="font-bold">{placeholder}</span>}
         <div className="flex w-full flex-wrap items-center justify-center gap-2">
            {availableTimes.map((item, index) => (
               <span
                  key={index}
                  className={`font-bold w-12 text-center rounded cursor-pointer text-white ${selectedTime === item ? 'bg-blue-600' : 'bg-slate-600'
                     }`}
                  onClick={() => handleTimeClick(item)}
               >
                  {item}
               </span>
            ))}
         </div>
      </div>
   );
};

export default TimeSelector;
