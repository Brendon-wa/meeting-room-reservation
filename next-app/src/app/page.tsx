"use client"
import { api } from "@/services/api";
import { Rooms } from "./_components/rooms";
import { RoomDTO } from "@/dtos/RoomDTO";
import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";

export default function Home() {
  const [rooms, setRooms] = useState<RoomDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRooms() {
      try {
        setLoading(true)
        const response = await api.get('rooms/all')
        const roomList: RoomDTO[] = response.data.data;
        setRooms(roomList)
      } catch {
        const retry = confirm('Erro ao buscar dados. Tentar novamente?');
        if (retry) {
          getRooms();
        }
      } finally {
        setLoading(false)
      }
    }
    getRooms();
  }, [])

  return (
    <main className="flex flex-col w-11/12 mx-auto mb-5">
      {loading ? (
        <div className="flex flex-col items-center w-11/12 mx-auto gap-16 sm:p-8 justify-between">
          <RefreshCcw className="animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center w-11/12 mx-auto gap-16 sm:p-8 justify-between">
            <h1 className="text-3xl font-bold mt-5">Salas</h1>
          </div>
          <section className="flex flex-wrap justify-center items-center gap-4 w-full">
            {rooms?.map(item => (
              <Rooms key={item.id} data={item} />
            ))}
          </section>
        </>
      )}
    </main>
  );
}
