"use client"
import { RoomDTO } from "@/dtos/RoomDTO";
import { api } from "@/services/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserDTO } from "@/dtos/UserDTO";

interface ParamsProp {
   params: {
      detail: number;
   }
}

export default function RoomDetail({ params }: ParamsProp) {
   const [room, setRoom] = useState<RoomDTO>({} as RoomDTO);
   const [loading, setLoading] = useState(true);
   const [user, setUser] = useState<UserDTO>();
   const [errorMessage, setErrorMessage] = useState('');
   const { push } = useRouter();

   useEffect(() => {
      async function getRoomDetail() {
         try {
            setLoading(true)
            const response = await api.get(`/room/${params.detail}`)
            const roomList: RoomDTO = await response.data.data;
            setRoom(roomList)
         } catch {
            setErrorMessage('Ocorreu um erro ao buscar os detalhes da sala. Tente novamente mais tarde.');
         } finally {
            setLoading(false)
         }
      }
      getRoomDetail();
   }, [params.detail])

   useEffect(() => {
      const user = localStorage.getItem('@desafio:user');
      if (user) {
         const parsedUser = JSON.parse(user);
         setUser(parsedUser);
      }
   }, []);

   async function handleRedirect() {
      if (user) {
         push(`/booking?itemId=${room.id}`)
      } else {
         const confirmed = window.confirm(`Necessário acessar sua conta para realizar uma reserva.`);
         if (confirmed) {
            push('/login')
         }
      }
   }

   return (

      <div className="flex flex-col w-11/12 mx-auto mb-5">
         {loading ? (
            <div className="flex flex-col items-center w-11/12 mx-auto gap-16 sm:p-8 justify-between">
               <RefreshCcw className="animate-spin" />
            </div>
         ) : (
            <div className="flex flex-col items-center justify-center w-11/12 mx-auto gap-8 sm:p-8">
               <h1 className="text-3xl font-bold mt-5">{room.name}</h1>
               <Image
                  className="light:invert rounded"
                  src="/images.jpeg"
                  alt="Next.js logo"
                  width={500}
                  height={100}
                  priority
               />
               <span className="select-none text-md text-gray-800 w-8/12">{room.description}</span>
               <span className="truncate text-lg font-bold text-red-500">{new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
               }).format(Number(room.value))} / hora
               </span>

               <div className="flex flex-col w-full gap-2">
                  {!user?.is_admin && <button onClick={() => handleRedirect()} className="w-full text-center bg-slate-600 rounded-md p-2 font-bold text-white">Reservar</button>}
                  <Link className="w-full text-center bg-slate-400 rounded-md p-2 font-bold text-white" href="/">Voltar</Link>
               </div>
            </div>
         )}
         <div>
            {loading && <p>Carregando...</p>}
            {errorMessage && <p className="error">{errorMessage}</p>}
         </div>
      </div>
   )
};