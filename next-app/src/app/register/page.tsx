"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { Input } from "../_components/input";
import { useState } from "react";

const schema = z.object({
   name: z.string().min(3, 'Nome obrigatório'),
   email: z.string().email('E-mail obrigatório'),
   password: z.string().min(8, 'Minímo de 8 caracteres')
});

type FormData = z.infer<typeof schema>;

export default function Register() {
   const { push } = useRouter();
   const [ loading, setLoading ] = useState(false);

   const {
      register,
      handleSubmit,
      setError,
      formState: { errors },
   } = useForm<FormData>({
      resolver: zodResolver(schema)
   });

   async function handleRegister(form: FormData) {
      const payload = {
         name: form.name,
         email: form.email,
         password: form.password
      }
      try {
         setLoading(true)
         await api.post('/register', payload)
         push("/login")
      } catch {
         setError('root', { message: 'Erro de conexão. Tente novamente mais tarde.' });
      } finally {
         setLoading(false)
      }
   }

   return (
      <div className="flex flex-col w-11/12 mx-auto mb-5">
         <div className="flex flex-col items-center w-11/12 mx-auto gap-16 sm:p-8 justify-between">
            <h1 className="text-3xl font-bold mt-5">Cadastro</h1>
            <form className="flex flex-col gap-2 w-full mx-auto" onSubmit={handleSubmit((handleRegister))}>
               <Input
                  id="name"
                  placeholder="Nome"
                  label="Nome"
                  name="name"
                  type="text"
                  error={errors.name?.message}
                  register={register}
               />
               <Input
                  id="email"
                  placeholder="E-mail"
                  label="E-mail"
                  name="email"
                  type="email"
                  error={errors.email?.message}
                  register={register}
               />
               <Input
                  id="password"
                  placeholder="Senha"
                  label="Senha"
                  name="password"
                  type="password"
                  error={errors.password?.message}
                  register={register}
               />
               {errors && <span className="text-red-600">{errors.root?.message}</span>}
               <input value="Cadastrar" disabled={loading ? true : false} type="submit" className="border bg-slate-600 rounded-md p-2 w-full font-bold text-white" />
            </form>
         </div>
      </div>
   )
}