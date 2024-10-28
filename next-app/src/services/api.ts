import axios, { AxiosError } from 'axios';
import { parseCookies } from 'nookies';

const cookies = parseCookies();

export const api = !cookies['desafio:token'] ? axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_URL,
}) : axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_URL,
   headers: {
      Authorization: `${cookies['desafio:token']}`
   }
});

api.interceptors.response.use(response => {
   return response;
}, (error: AxiosError) => {
   return Promise.reject(error)
})