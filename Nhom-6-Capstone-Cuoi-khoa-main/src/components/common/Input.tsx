'use client';

import React, { InputHTMLAttributes, forwardRef, useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Eye, EyeOff } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="min-w-0 space-y-1.5">
        {label && (
          <label className="text-xs font-black text-black uppercase tracking-widest ml-1 mb-2 block">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'flex h-12 w-full rounded-none border-4 border-black bg-white px-4 py-3 text-xs font-black transition-all duration-200 outline-none placeholder:text-gray-400 placeholder:font-bold focus:bg-gray-50 shadow-none focus:shadow-none',
              error && 'border-red-500 bg-red-50',
              isPassword && 'pr-11',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-[11px] font-semibold text-red-500 break-words whitespace-normal flex items-center gap-1 ml-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
