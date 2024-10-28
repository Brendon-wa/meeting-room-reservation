"use client";

import { ModalContext } from "@/context/modal";
import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import Button from "./button";
import { X } from "lucide-react";
import { UserDTO } from "@/dtos/UserDTO";

export function ModalProfile() {
   const { handleModalVisible } = useContext(ModalContext);
   const modalRef = useRef<HTMLDivElement | null>(null);
   const [user, setUser] = useState<UserDTO>();

   useEffect(() => {
      const user = localStorage.getItem('@desafio:user');
      if (user) {
         const parsedUser = JSON.parse(user);
         setUser(parsedUser);
      }
   }, []);

   const handleModalClick = (e: MouseEvent<HTMLDivElement>, option: string) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
         handleModalVisible(option);
      }
   };

   return (
      <div
         className="absolute bg-black/60 w-screen min-h-screen z-10"
         onClick={(e) => handleModalClick(e, 'profile')}
      >
         <div className="absolute inset-0 flex items-center justify-center">
            <div
               ref={modalRef}
               className="bg-background shadow-lg w-4/5 mx-auto md:w-1/2 max-w-2xl p-3 rounded-lg"
            >
               <div className="flex justify-between px-2 items-center">
                  <h1 className="font-bold text-lg md:text-2xl">
                     Detalhes da conta
                  </h1>

                  <Button onClick={() => handleModalVisible('profile')} variant="destructive">
                     <X size={20} />
                  </Button>
               </div>


               <div className="w-full border-b border-gray-800 my-4" />

               <div className="space-y-4">
                  <h1 className="font-bold text-lg">Detalhes do usuário</h1>

                  <div className="flex gap-1">
                     <h2 className="font-bold">Nome:</h2>
                     <p>{user?.name}</p>
                  </div>

                  <div className="flex gap-1">
                     <h2 className="font-bold">Email:</h2>
                     <p>{user?.email}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
