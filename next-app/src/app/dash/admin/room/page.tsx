"use client"
import { api } from "@/services/api";
import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/app/_components/input";
import { TextArea } from "@/app/_components/textarea";
import { NumericInput } from "@/app/_components/numeric_input";
import { redirect } from "next/navigation";

const schema = z.object({
   name: z.string(),
   description: z.string(),
   value: z.string().regex(/^\d+([\.,]\d{1,2})?$/, "Valor inválido")
}).required();

type FormData = z.infer<typeof schema>;

export default function NewRoom() {
   const [loading, setLoading] = useState(false);

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FormData>({
      resolver: zodResolver(schema),
   });

   async function storeRoom(form: FormData) {
      const formattedValue = form.value.replace(',', '.');
      const payload = {
         name: form.name,
         description: form.description,
         value: formattedValue,
      }
      try {
         setLoading(true)
         await api.post(`/room`, payload)
      } catch {
         const retry = confirm('Erro ao buscar dados. Tentar novamente?');
         if (retry) {
            storeRoom(form);
         }
      } finally {
         setLoading(false)
         redirect('/dash/admin/rooms')
      }
   }

   return (
      <div className="flex flex-col w-11/12 mx-auto mb-5">
         {loading ? (
            <div className="flex flex-col items-center w-11/12 mx-auto gap-16 sm:p-8 justify-between">
               <RefreshCcw className="animate-spin" />
            </div>
         ) : (
            <div className="flex flex-col items-center w-11/12 mx-auto gap-16 sm:p-8 justify-between">
               <h1 className="text-3xl font-bold mt-5">Cadastrar sala</h1>
               <form className="flex flex-col gap-2 w-full mx-auto" onSubmit={handleSubmit((storeRoom))}>
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