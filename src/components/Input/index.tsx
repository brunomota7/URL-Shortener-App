"use client";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

interface InputProps {
  label: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function Input({
  label,
  type,
  value,
  placeholder,
  onChange,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <section className="w-full h-[80px] flex flex-col justify-start">
      <label className="text-[14px] font-semibold text-white mb-[5px]">{label}</label>
      {type !== "password" ? (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          required
          className="w-full h-12 p-3 pl-4 border-2 border-sky-700 rounded-lg outline-none bg-sky-900 text-white placeholder-sky-400 focus:border-sky-500 transition-colors duration-200"
        />
      ) : (
        <div className="relative w-full flex flex-col gap-1">
          <input 
            type={ showPassword ? "text" : "password" } 
            value={value}
            placeholder={placeholder}
            onChange={onChange}
            required
            className="w-full h-12 p-3 pl-4 border-2 border-sky-700 rounded-lg outline-none bg-sky-900 text-white placeholder-sky-400 focus:border-sky-500 transition-colors duration-200"
          />
          <button
            type="button"
            onClick={ toggleShowPassword }
            className="absolute right-4 top-6 -translate-y-1/2 text-sky-500"
          >
            { showPassword ? <EyeOff /> : <Eye /> }
          </button>
        </div>
      )}
    </section>
  );
}
