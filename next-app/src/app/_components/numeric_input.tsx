import React from 'react';
import { FieldValues, UseFormRegister, Path } from 'react-hook-form';

interface NumericInputProps<T extends FieldValues> {
   placeholder: string;
   label: string;
   name: Path<T>;
   error?: string;
   register: UseFormRegister<T>;
}

export function NumericInput<T extends FieldValues>({
   placeholder,
   label,
   name,
   error,
   register,
}: NumericInputProps<T>) {
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      const numericValue = value.replace(/[^0-9,]/g, '');

      e.target.value = numericValue;
   };

   return (
      <div>
         <label htmlFor={name} className="block text-sm font-bold text-gray-700">
            {label}
         </label>
         <input
            id={name}
            {...register(name)}
            placeholder={placeholder}
            onChange={handleInputChange}
            className={`border ${error ? 'border-red-600' : 'border-gray-300'} rounded-md p-2 w-full`}
            type="text"
         />
         {error && <span className="text-red-600 text-sm">{error}</span>}
      </div>
   );
}
