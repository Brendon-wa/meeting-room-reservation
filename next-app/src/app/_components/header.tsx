"use client"
import { UserDTO } from "@/dtos/UserDTO";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ModalContext } from "@/context/modal";
import { Menu } from "lucide-react";

export default function Header() {
  const [user, setUser] = useState<UserDTO>();
  const { signOut } = useAuth();
  const { handleModalVisible } = useContext(ModalContext);

  useEffect(() => {
    const user = localStorage.getItem('@desafio:user');
    if (user) {
      const parsedUser = JSON.parse(user);
      setUser(parsedUser);
    }
  }, []);

  function handleSignOut() {
    signOut();
  }


  function handleOpenModal(option: string) {
    handleModalVisible(option);
  }

  return (
    <header className="bg-zinc-400 flex border items-center rounded-b-3xl justify-center mx-auto w-full">
      <div className="flex justify-between items-center py-5 w-11/12 sm:max-w-xs md:hidden">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={38}
            priority
          />
        </Link>
        <button onClick={() => handleOpenModal('menu')}>
          <Menu />
        </button>
      </div>
      <div className="items-center w-10/12 mx-auto py-10 gap-16 sm:p-20 hidden md:flex">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={38}
            priority
          />
        </Link>
        <Link href="/" className="font-bold text-white">Início</Link>
        {user?.is_admin && (
          <>
            <Link href="/dash/admin/rooms" className="font-bold text-white">Salas</Link>
            <Link href="/dash/admin/users" className="font-bold text-white">Usuários</Link>
          </>
        )}

        {user && (
          <Link href="/dash/bookings" className="font-bold text-white">Reservas</Link>
        )}
      </div>

      <div className="w-2/12 justify-start gap-6 hidden md:flex">
        {!user ?
          <>
            <Link href="/login" className="font-bold text-white">Entrar</Link>
            <Link href="/register" className="font-bold text-white">Cadastrar</Link>
          </>
          :
          <>
            <Link href="#" className="font-bold text-white" onClick={() => handleModalVisible('profile')}>Perfil</Link>
            <button onClick={() => handleSignOut()} className="font-bold text-red-500">Sair</button></>
        }
      </div>
    </header>
  );
}
