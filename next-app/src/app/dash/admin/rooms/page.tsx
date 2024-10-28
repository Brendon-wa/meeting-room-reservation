"use client"
import { CardRoom } from "@/app/_components/rooms_card";
import { RoomDTO } from "@/dtos/RoomDTO";
import { api } from "@/services/api";
import { RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ListingUsers() {
   const [rooms, setRooms] = useState<RoomDTO[]>([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      async function getRooms() {
         setLoading(true);
         await api.get('/rooms/all').then(response => {
            const roomsList: RoomDTO[] = response.data.data;
            setRooms(roomsList);
         }).catch(() => {
            const retry = confirm('Erro ao buscar dados. Tentar novamente?');
            if (retry) {
               getRooms();
            }
         }).finally(() => {
            setLoading(false);
         })
      }
      getRooms()
   }, []);

   return (
      <div className="flex flex-col w-11/12 mx-auto mb-5">
         {loading ? (
            <div className="flex flex-col items-center w-11/12 mx-auto gap-16 sm:p-8 justify-between">
               <RefreshCcw className="animate-spin" />
            </div>
         ) : (
            <>
               <div className="flex items-center justify-center w-full space-x-6 mx-auto flex-wrap py-2">
                  <h1 className="text-3xl font-bold">Salas Cadastradas</h1>
                  <Link href="/dash/admin/room" className="border bg-slate-600 rounded-md p-2 font-bold text-white">Nova sala</Link>
               </div>
               <div className="flex flex-col items-center w-11/12 mx-auto gap-16 sm:p-8 justify-between">
                  {rooms.length === 0 ? (
                     <p className="text-xl text-center font-bold text-gray-600">
                        Sem salas cadastrados
                     </p>
                  ) : (
                     <section className="flex flex-col justify-center items-center gap-4 w-full">
                        {rooms.map((item) => (
                           <CardRoom key={item.id} room={item} />
                        ))}
                     </section>
                  )}
               </div>
            </>
         )}
      </div>
   )
}