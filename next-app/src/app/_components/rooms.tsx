import { RoomDTO } from "@/dtos/RoomDTO";
import Image from "next/image";
import Link from "next/link";

interface RoomProps {
   data: RoomDTO
}

export function Rooms({ data }: RoomProps) {
   return (
      <div className="shrink-0 grow-0 basis-full min-w-48 max-w-80 select-none rounded-2xl border my-5 shadow-xl">
         <div className="space-y-3 p-0">
            <div className="relative h-36 w-full">
               <Image
                  className="light:invert rounded-t-2xl object-cover"
                  src="/images.jpeg"
                  alt={`Image ${data.name}`}
                  fill
               />
            </div>
            <div className="mx-auto w-11/12 space-y-2">
               <h3 className="line-clamp-1 font-semibold">{data.name}</h3>
               <p className="truncate text-sm text-gray-400">
                  {new Intl.NumberFormat("pt-BR", {
                     style: "currency",
                     currency: "BRL",
                  }).format(Number(data.value))} / hora
               </p>
            </div>
            <Link className="flex text-center w-full items-center justify-center border bg-zinc-500 font-bold text-white py-2 rounded-2xl" href={`/room/${data.id}`}>
               Ver detalhes
            </Link>
         </div>
      </div>
   )
}