"use client";
import { UserDTO } from "@/dtos/UserDTO";

interface UserProps {
   user: UserDTO
}

export function CardUser({ user }: UserProps) {
   return (
      <article className="flex flex-col w-11/12 bg-gray-200 border-2 gap-2 p-2 rounded-lg hover:scale-105 duration-300">
         <div className="flex gap-2">
            <span className="font-bold">Nome: </span>
            <span className="capitalize">{user.name}</span>
         </div>
         <div className="flex gap-2">
            <span className="font-bold">Email: </span>
            <span>{user.email}</span>
         </div>
      </article>
   );
}