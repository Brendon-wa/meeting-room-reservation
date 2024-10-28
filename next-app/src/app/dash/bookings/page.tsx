"use client"
import { CardBookings } from "@/app/_components/bookings_card";
import { BookingDTO } from "@/dtos/BookingDTO";
import { UserDTO } from "@/dtos/UserDTO";
import { api } from "@/services/api";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

export default function ListingBookings() {
   const [bookings, setBookings] = useState<BookingDTO[]>([]);
   const [, setUser] = useState<UserDTO>();
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const fetchUserAndBookings = async () => {
         try {
            const fetchedUser = getUserFromLocalStorage();
            if (fetchedUser) {
               setUser(fetchedUser);
               await getBookings(fetchedUser);
            }
         } catch (error) {
            console.error('Erro ao buscar o usuário:', error);
         }
      };
      fetchUserAndBookings();
   }, []);

   const getUserFromLocalStorage = () => {
      const user = localStorage.getItem('@desafio:user');
      return user ? JSON.parse(user) : null;
   };

   const getBookings = async (user: UserDTO) => {
      try {
         setLoading(true)
         const response = user.is_admin ? await api.get('/bookings/admin') : await api.get('/bookings');
         const bookingList = response.data.data;

         const updatedBookings = bookingList.map((booking: BookingDTO) => ({
            ...booking,
            status: booking.status === 'reserved' ? 'Reservado' : booking.status === 'cancelled' ? 'Cancelado' : booking.status,
         }));

         setBookings(updatedBookings);
      } catch (error) {
         console.error('Erro ao buscar as reservas:', error);
      } finally {
         setLoading(false)
      }
   };

   return (
      <div className="flex flex-col w-11/12 mx-auto mb-5">
         {loading ? (
            <div className="flex flex-col items-center w-11/12 mx-auto gap-16 sm:p-8 justify-between">
               <RefreshCcw className="animate-spin" />
            </div>
         ) : (
            <div className="flex flex-col items-center w-11/12 mx-auto gap-16 sm:p-8 justify-between">
               <h1 className="text-3xl font-bold mt-5">Reservas</h1>
               {bookings.length === 0 ? (
                  <p className="text-xl text-center font-bold text-gray-600">
                     Sem reservas cadastradas
                  </p>
               ) : (
                  <section className="flex flex-col justify-center items-center gap-4 w-full">
                     {bookings.map((item) => (
                        <CardBookings key={item.id} booking={item} />
                     ))}
                  </section>
               )}
            </div>
         )}
      </div>
   )
}