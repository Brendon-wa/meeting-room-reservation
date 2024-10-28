"use client"
import { RoomDTO } from "@/dtos/RoomDTO";
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/app/_components/input";
import { TextArea } from "@/app/_components/textarea";
import { NumericInput } from "@/app/_components/numeric_input";
import { redirect } from "next/navigation";

interface ParamsProp {
   params: {
      detail: number;
   }
}

const schema = z.object({
   name: z.string(),
   description: z.string(),
   value: z.string().regex(/^\d+([\.,]\d{1,2})?$/, "Valor inválido")
}).required();

type FormData = z.infer<typeof schema>;

export default function RoomDetail({ params }: ParamsProp) {
   const [room, setRoom] = useState<RoomDTO>({} as RoomDTO);
   const [loading, setLoading] = useState(false);

   const {
      register,
      setValue,
      handleSubmit,
      formState: { errors },
   } = useForm<FormData>({
      resolver: zodResolver(schema),
   });

   async function updateRoom(form: FormData) {
      const formattedValue = form.value.replace(',', '.');
      const payload = {
         name: form.name,
         description: form.description,
         value: formattedValue,
      }
      try {
         setLoading(true);
         await api.put(`/room/${room.id}`, payload)
         redirect('/dash/admin/rooms');
      } catch {
         const retry = confirm('Erro ao atualizar dados. Tentar novamente?');
         if (retry) {
            updateRoom(form);
         }
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      async function getRoomDetail() {
         try {
            setLoading(true)
            const response = await api.get(`/room/${params.detail}`)
            const roomList: RoomDTO = await response.data.data;
            setRoom(roomList)
            setValue("name", response.data.data.name);
            setValue("description", response.data.data.description);
            setValue("value", response.data.data.value);
         } catch {
            const retry = confirm('Erro ao buscar dados. Tentar novamente?');
            if (retry) {
               getRoomDetail();
            }
         } finally {
            setLoading(false)
         }
      }
      getRoomDetail();
   }, [params.detail, setValue])

   return (
      <div className="flex flex-col w-11/12 mx-auto mb-5">
         {loading ? (
            <div className="flex flex-col items-center w-11/12 mx-auto gap-16 sm:p-8 justify-between">
               <RefreshCcw className="animate-spin" />
            </div>
         ) : (
            <div className="flex flex-col items-center w-11/12 mx-auto gap-16 sm:p-8 justify-between">
               <h1 className="text-3xl font-bold mt-5">Editar sala: {params.detail}</h1>
               <form className="flex flex-col gap-2 w-full mx-auto" onSubmit={handleSubmit((updateRoom))}>
                  <Input
                     id="name"
                     placeholder="Nome"
                     label="Nome"
                     name="name"
                     type="string"
                     error={errors.name?.message}
                     register={register}
                  />
                  <TextArea
                     id="description"
                     placeholder="Descrição"
                     label="Descrição"
                     name="description"
                     error={errors.description?.message}
                     register={register}
                  />
                  <NumericInput
                     placeholder="R$ 0,00"
                     label="Valor / hora"
                     name="value"
                     error={errors.value?.message}
                     register={register}
                  />
                  <input type="submit" className="border bg-slate-600 rounded-md p-2 w-full font-bold text-white" />
               </form>
            </div>
         )}
      </div>
   )
};