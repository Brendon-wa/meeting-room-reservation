"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthContext } from "@/context/AuthContext";
import { useContext, useState } from "react";
import { Input } from "../_components/input";
import Link from "next/link";
import { AxiosError } from "axios";

const schema = z.object({
   email: z.string().email('E-mail obrigatório'),
   password: z.string().min(8, 'Minímo de 8 caracteres')
});

type FormData = z.infer<typeof schema>;

export default function Login() {
   const { signIn } = useContext(AuthContext);
   const [ loading, setLoading ] = useState(false);

   const {
      register,
      handleSubmit,
      setError,
      formState: { errors },
   } = useForm<FormData>({
      resolver: zodResolver(schema)
   });

   async function handleSignIn(form: FormData) {
      try {
         setLoading(true)
         await signIn(form)
      } catch (error) {
         const axiosError = error as AxiosError;
         if (axiosError.response) {
            if (axiosError.response.status === 401) {
               setError('root', { message: 'E-mail ou senha incorretos.' });
            } else if (axiosError.response.status === 400) {
               setError('root', { message: 'Dados de registro inválidos.' });
            } else {
               setError('root', { message: 'Ocorreu um erro ao registrar. Tente novamente.' });
            }
         } else {
            setError('root', { message: 'Erro de conexão. Tente novamente mais tarde.' });
         }
      } finally {
         setLoading(false)
      }
   }

   return (
      <div className="flex flex-col w-11/12 mx-auto mb-5">
         <div className="flex flex-col items-center w-11/12 mx-auto gap-16 sm:p-8 justify-between">
            <h1 className="text-3xl font-bold mt-5">Entrar</h1>
            <form className="flex flex-col gap-2 w-full mx-auto" onSubmit={handleSubmit((handleSignIn))}>
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
               <input value="Entrar" disabled={loading ? true : false} type="submit" className="border bg-slate-600 rounded-md p-2 w-full font-bold text-white" />
               <Link className="p-2 w-full font-bold text-slate-600" href={'/register'} >Não possui uma conta? Cadastre-se aqui.</Link>
            </form>
         </div>
      </div>
   )
}