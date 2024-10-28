"use client";

import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import Button from "./button";
import { ModalContext } from "@/context/modal";
import { UserDTO } from "@/dtos/UserDTO";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { X } from "lucide-react";

export function MenuTicket() {
   const modalRef = useRef<HTMLDivElement | null>(null);
   const { handleModalVisible } = useContext(ModalContext);
   const [user, setUser] = useState<UserDTO>();
   const { signOut } = useAuth();

   useEffect(() => {
      const user = localStorage.getItem('@desafio:user');
      if (user) {
         const parsedUser = JSON.parse(user);
         setUser(parsedUser);
      }
   }, []);

   function handleSignOut(option: string) {
      signOut();
      handleModalVisible(option);
   }

   const handleModalClick = (e: MouseEvent<HTMLAnchorElement>, option: string) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
         handleModalVisible(option);
      }
   };

   return (
      <div
         className="fixed bg-black/60 w-screen min-h-screen h-full z-10"
         onClick={() => handleModalClick}
      >
         <div className="absolute inset-0 flex items-start justify-end">
            <div
               ref={modalRef}
               className="bg-background h-screen shadow-lg w-4/5 md:w-1/2 max-w-2xl p-3 rounded-lg items-end justify-end"
            >
               <div className="flex flex-col justify-end px-4 gap-2 items-end">
                  <Button onClick={() => handleModalVisible('menu')} variant="destructive" className="w-10 ml-auto">
                     <X>X</X>
                  </Button>
                  {user?.is_admin && (
                     <>
                        <Link href="/dash/admin/rooms" className="font-bold" onClick={() => handleModalVisible('menu')}>Salas</Link>
                        <Link href="/dash/admin/users" className="font-bold" onClick={() => handleModalVisible('menu')}>Usuários</Link>
                     </>
                  )}
                  {user && (
                     <div className="flex flex-col gap-2 items-end">
                        <Link href="/" className="font-bold" onClick={() => handleModalVisible('menu')}>Início</Link>
                        <Link href="/dash/bookings" className="font-bold" onClick={() => handleModalVisible('menu')}>Reservas</Link>
                     </div>
                  )}
                  {!user ?
                     <>
                        <Link href="/login" className="font-bold" onClick={() => handleModalVisible('menu')}>Login</Link>
                        <Link href="/register" className="font-bold" onClick={() => handleModalVisible('menu')}>Cadastrar</Link>
                     </>
                     :
                     <>
                        <button className="font-bold" onClick={() => handleModalVisible('profile')}>Perfil</button>
                        <button onClick={() => handleSignOut('menu')} className="font-bold text-red-500">Logout</button>
                     </>
                  }
               </div>
            </div>
         </div>
      </div>
   );
}
