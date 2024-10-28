"use client";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface InputProps<T extends FieldValues> {
   id: string;
   placeholder: string;
   label: string;
   name: Path<T>;
   error?: string;
   register: UseFormRegister<T>;
}

export function TextArea<T extends FieldValues>({ placeholder, label, name, error, register }: InputProps<T>) {
   return (
      <>
         <label htmlFor={name} className="block text-sm font-bold text-gray-700">{label}</label>
         <textarea
            id={name}
            {...register(name)}
            placeholder={placeholder}
            className={`border ${error ? 'border-red-600' : 'border-gray-300'} rounded-md p-2 w-full`}
            rows={5}
         />
         {error && <span className="text-red-600">{error}</span>}
      </>
   );
}