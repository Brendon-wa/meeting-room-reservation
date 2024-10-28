"use client";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface InputProps<T extends FieldValues> {
   id: string;
   placeholder: string;
   label: string;
   name: Path<T>;
   type: string;
   error?: string;
   register: UseFormRegister<T>;
}

export function Input<T extends FieldValues>({ placeholder, label, name, type, error, register }: InputProps<T>) {
   return (
      <>
         <label htmlFor={name} className="block text-sm font-bold text-gray-700">{label}</label>
         <input
            id={name}
            {...register(name)}
            placeholder={placeholder}
            className={`border ${error ? 'border-red-600' : 'border-gray-300'} rounded-md p-2 w-full`}
            type={type}
         />
         {error && <span className="text-red-600">{error}</span>}
      </>
   );
}