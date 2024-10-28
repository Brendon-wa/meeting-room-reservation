"use client"
import { api } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from 'date-fns';
import { RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TimeSelector from "../_components/time_options";
import { useRouter } from "next/navigation";

const schema = z.object({
   room_id: z.string(),
   date: z.string(),
   start_time: z.string(),
   end_time: z.string(),
});

type FormData = z.infer<typeof schema>;

interface ParamsProp {
   searchParams: {
      itemId: number
   }
}

export default function Booking({ searchParams }: ParamsProp) {
   const [loading, setLoading] = useState(false);
   const [selectedDate, setSelectedDate] = useState<Date>();
   const [formatedDate, setFormatedDate] = useState<string>();
   const [selectedStartTime, setSelectedStartTime] = useState<string>();
   const [selectedEndTime, setSelectedEndTime] = useState<string>();
   const [avalilableStartTimes, setAvalilableStartTimes] = useState([]);
   const [avalilableEndTimes, setAvalilableEndTimes] = useState([]);
   const { push } = useRouter();

   const {
      handleSubmit,
      setValue,
      formState: { },
   } = useForm<FormData>({
      resolver: zodResolver(schema),
   });

   async function getStartTimeData(date: string) {
      try {
         setLoading(true)
         const response = await api.get(`/rooms?date=${date}&room_id=${searchParams.itemId}`);
         setAvalilableStartTimes(response.data.data[0].available_times)
      } catch {
         const retry = confirm('Erro ao buscar dados. Tentar novamente?');
         if (retry) {
            getStartTimeData(date);
         }
      } finally {
         setLoading(false)
      }
   }

   async function getEndTimeData(time: string) {
      try {
         setLoading(true)
         const response = await api.get(`/rooms/endTime?room_id=${searchParams.itemId}&date=${formatedDate}&start_time=${time}`);
         setAvalilableEndTimes(response.data.data[0].available_times)
      } catch {
         const retry = confirm('Erro ao buscar dados. Tentar novamente?');
         if (retry) {
            getEndTimeData(time);
         }
      } finally {
         setLoading(false)
      }
   }

   async function storeBooking() {
      try {
         setLoading(true)
         const payload = {
            room_id: searchParams.itemId,
            date: formatedDate,
            start_time: selectedStartTime,
            end_time: selectedEndTime
         }
         await api.post(`/booking`, payload)
         push('/dash/bookings');
      } finally {
         setLoading(false)
      }
   }

   function formatDate(date: Date) {
      const formatedDate = format(date, 'yyyy-MM-dd')
      setFormatedDate(formatedDate)
      setValue('date', formatedDate)
      setValue('start_time', '')
      setValue('end_time', '')
      setSelectedDate(date)
      getStartTimeData(formatedDate);
   }

   useEffect(() => {
      setValue('room_id', searchParams.itemId.toString())
   })

   useEffect(() => {
      setSelectedStartTime('');
      setSelectedEndTime('');
   }, [selectedDate]);

   useEffect(() => {
      setSelectedEndTime('');
   }, [selectedStartTime]);

   return (
      <div className="flex flex-col w-11/12 mx-auto mb-5">
         {loading ? (
            <div className="flex flex-col items-center w-11/12 mx-auto gap-16 sm:p-8 justify-between">
               <RefreshCcw className="animate-spin" />
            </div>
         ) : (
            <div className="flex flex-col items-center w-11/12 mx-auto gap-4 sm:p-8 justify-between">
               <h1 className="text-3xl font-bold mt-5">Criar reserva</h1>
               <form className="flex flex-col gap-2 mx-auto w-full" onSubmit={handleSubmit((storeBooking))}>
                  <label htmlFor="day" className="block text-md text-center font-bold text-gray-700">Selecione um dia</label>
                  <DayPicker
                     mode="single"
                     required
                     selected={selectedDate}
                     onSelect={formatDate}
                     locale={ptBR}
                     className="capitalize self-center border shadow-xl p-3"
                     disabled={{ before: new Date() }}
                     footer={selectedDate && `Data selecionada: ${selectedDate.toLocaleDateString()}`}
                  />
                  <TimeSelector
                     selectedDate={selectedDate}
                     availableTimes={avalilableStartTimes}
                     getEndTimeData={getEndTimeData}
                     selectedTime={selectedStartTime}
                     setSelectedStartTime={setSelectedStartTime}
                     placeholder="Selecione a hora de início da reserva"
                     setValue={(e) => setValue('start_time', e)}
                     time="start"
                  />

                  {selectedStartTime && (
                     <TimeSelector
                        selectedDate={selectedDate}
                        availableTimes={avalilableEndTimes}
                        getEndTimeData={getEndTimeData}
                        selectedTime={selectedEndTime}
                        setSelectedStartTime={setSelectedEndTime}
                        placeholder="Selecione a hora do fim da reserva"
                        setValue={(e) => setValue('end_time', e)}
                        time="end"
                     />
                  )}
                  {selectedStartTime && selectedEndTime && <input type="submit" className="border bg-slate-600 rounded-md p-2 w-full font-bold text-white mt-5" />}
               </form>
               <div className="flex flex-col w-full mx-auto">
                  <Link className="w-full text-center bg-slate-400 rounded-md p-2 font-bold text-white" href={`/room/${searchParams.itemId}`}>Voltar</Link>
               </div>
            </div>
         )}
      </div >
   )
};