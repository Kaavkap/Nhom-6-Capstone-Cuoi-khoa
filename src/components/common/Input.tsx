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
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'flex h-10 rounded-lg border border-gray-300 bg-white/60 px-4 py-2 text-sm transition-all duration-200 outline-none placeholder:text-gray-400 focus:bg-white/90 focus:border-[#06BBCC] focus:ring-4 focus:ring-[#06BBCC]/10',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-500/10',
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
