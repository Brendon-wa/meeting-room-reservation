"use client";
import { RoomDTO } from "@/dtos/RoomDTO";
import Button from "./button";
import Link from "next/link";
import { api } from "@/services/api";
import { useState } from "react";
import { redirect } from "next/navigation";
import { AxiosError } from "axios";

interface RoomProps {
   room: RoomDTO
}

export function CardRoom({ room }: RoomProps) {
   const [, setLoading] = useState(false);

   async function handleDeleteRoom(id: number) {
      const confirmed = window.confirm(`Tem certeza que deseja excluir a sala ${id}?`);

      if (confirmed) {
         try {
            setLoading(true);
            await api.delete(`/room/${id}`)
         } catch (error) {
            const axiosError = error as AxiosError;

            if (axiosError.response) {
               const data = axiosError.response.data as { Erro?: string };
               if (data.Erro) {
                  alert(data.Erro);
               } else {
                  alert('Ocorreu um erro ao tentar excluir a sala.');
               }
            } else {
               alert('Erro de conexão. Tente novamente mais tarde.');
            }
         } finally {
            setLoading(false);
            redirect('/dash/admin/rooms');
         }
      }
   }

   return (
      <article className="flex flex-col w-11/12 bg-gray-200 border-2 gap-2 p-2 rounded-lg hover:scale-105 duration-300">
         <h2>
            <span className="font-bold">Nome: </span>
            {room.name}
         </h2>
         <p>
            <span className="font-bold">Descrição: </span>
            {room.description}
         </p>
         <p>
            <span className="font-bold">Valor / hora: </span>
            {new Intl.NumberFormat("pt-BR", {
               style: "currency",
               currency: "BRL",
            }).format(Number(room.value))}
         </p>

         <div className="flex">
            <Button variant="secondary">
               <Link href={`/dash/admin/room/${room.id}`}>
                  Editar
               </Link>
            </Button>
            <Button
               variant="destructive"
               onClick={() => handleDeleteRoom(room.id)}
            >
               Deletar
            </Button>
         </div>
      </article>
   );
}