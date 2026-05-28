import React, { ButtonHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  isLoading = false,
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'bg-[#06BBCC] text-black border-4 border-black hover:bg-black hover:text-white shadow-none uppercase tracking-widest',
    secondary: 'bg-[#FF9F1C] text-black border-4 border-black hover:bg-black hover:text-white shadow-none uppercase tracking-widest',
    outline: 'border-4 border-black bg-transparent hover:bg-black hover:text-white text-black shadow-none uppercase tracking-widest',
    ghost: 'bg-transparent hover:bg-gray-100 text-black shadow-none uppercase tracking-widest',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-none px-6 py-4 text-xs font-black transition-all focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 active:translate-x-0.5 active:translate-y-0.5',
        variants[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
