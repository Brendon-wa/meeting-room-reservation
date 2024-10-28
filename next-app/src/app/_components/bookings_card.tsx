"use client";
import { BookingDTO } from "@/dtos/BookingDTO";
import dayjs from "dayjs";
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserDTO } from "@/dtos/UserDTO";
import Button from "./button";
import Link from "next/link";

interface BookingProps {
   booking: BookingDTO
}

const isFutureDate = (dateString: string) => {
   const date = dayjs(dateString, 'YYYY-MM-DD HH:mm', true);

   return date.isValid() && date.isAfter(dayjs());
};

export function CardBookings({ booking }: BookingProps) {
   const { push } = useRouter()
   const [, setLoading] = useState(false);
   const [user, setUser] = useState<UserDTO>();
   const showComponent = isFutureDate(booking.date + booking.start_time);

   async function handleCancelBooking(id: number) {
      const confirmed = window.confirm(`Tem certeza que deseja cancelar a reserva na sala ${booking.room_name} com data de ${dayjs(booking.date).format('DD/MM/YYYY')} das ${booking.start_time} até ${booking.end_time}?`);

      if (confirmed) {
         try {
            setLoading(true);
            await api.put(`/booking/cancel/${id}`)
         } catch {
            const retry = confirm('Erro ao realizar requisição. Tentar novamente?');
            if (retry) {
               handleCancelBooking(id);
            }
         } finally {
            setLoading(false);
            push('/dash/bookings');
         }
      }
   }

   useEffect(() => {
      const user = localStorage.getItem('@desafio:user');
      if (user) {
         const parsedUser = JSON.parse(user);
         setUser(parsedUser);
      }
   }, []);

   return (
      <article className="flex w-11/12 items-center justify-center bg-gray-200 border-2 gap-2 p-2 rounded-lg hover:scale-105 duration-300">
         <div className="w-8/12">
            <h2>
               <span className="font-bold">Sala: </span>
               {booking.room_name}
            </h2>
            <p>
               <span className="font-bold">Início Reserva: </span>
               {dayjs(booking.date + booking.start_time).format('DD/MM/YYYY HH:mm')}
            </p>
            <p>
               <span className="font-bold">Fim Reserva: </span>
               {dayjs(booking.date + booking.end_time).format('DD/MM/YYYY HH:mm')}
            </p>
            <p>
               <span className="font-bold">Status: </span>
               {booking.status}
            </p>
            <p className="capitalize">
               <span className="font-bold">Locatário: </span>
               {booking.user_name}
            </p>
         </div>
         {(showComponent && booking.status === 'Reservado' && !user?.is_admin) ? (
            <div className="flex flex-col w-4/12 gap-2">
               <Link
                  className="text-center bg-gray-500 rounded-md w-full sm:w-8/12 p-2 font-bold text-white"
                  href={`/dash/bookings/[detail]?room_id=${booking.room_id}&booking_id=${booking.id}`}
               >
                  Editar
               </Link>
               <Button
                  className="text-center bg-red-400 rounded-md w-full sm:w-8/12 p-2 font-bold text-white"
                  onClick={() => handleCancelBooking(booking.id)}
               >
                  Cancelar
               </Button>
            </div>
         ) : (
            <div className="w-4/12"></div>
         )}

      </article>
   );
}