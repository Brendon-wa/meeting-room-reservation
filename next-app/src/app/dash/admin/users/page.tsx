"use client"
import { CardUser } from "@/app/_components/users_card";
import { UserDTO } from "@/dtos/UserDTO";
import { api } from "@/services/api";
import { RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

export default function ListingUsers() {
   const [users, setUsers] = useState<UserDTO[]>([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      async function getUsers() {
         try {
            setLoading(true)
            const response = await api.get('/users')
            const usersList: UserDTO[] = response.data.data;
            setUsers(usersList);
         } catch {
            const retry = confirm('Erro ao buscar dados. Tentar novamente?');
            if (retry) {
               getUsers();
            }
         } finally {
            setLoading(false)
         }
      }
      getUsers()
   }, [])

   return (
      <div className="flex flex-col w-11/12 mx-auto mb-5">
         {loading ? (
            <div className="flex flex-col items-center w-11/12 mx-auto gap-16 sm:p-8 justify-between">
               <RefreshCcw className="animate-spin" />
            </div>
         ) : (
            <div className="flex flex-col items-center w-11/12 mx-auto gap-16 sm:p-8 justify-between">
               <h1 className="text-3xl font-bold mt-5">Usuários</h1>
               {users.length === 0 ? (
                  <p className="text-xl text-center font-bold text-gray-600">
                     Sem usuários cadastrados
                  </p>
               ) : (
                  <section className="flex flex-col justify-center items-center gap-4 w-full">
                     {users.map((item) => (
                        <CardUser key={item.id} user={item} />
                     ))}
                  </section>
               )}
            </div>
         )}
      </div>
   )
}