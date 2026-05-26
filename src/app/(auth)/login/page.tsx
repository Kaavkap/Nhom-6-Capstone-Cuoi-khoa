'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import authService from '@/services/authService';
import useAuthStore from '@/store/useAuthStore';

const loginSchema = z.object({
  taiKhoan: z.string().min(1, 'Username is required'),
  matKhau: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain one uppercase')
    .regex(/[0-9]/, 'Must contain one number'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.login(data);
      setAuth(user);
      router.push('/');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response: { data: string } };
        setError(axiosError.response.data || 'Invalid username or password');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl px-6 mx-auto"
      >
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-700 hover:text-[#06BBCC] mb-8 transition-colors group text-sm font-semibold tracking-wide"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <div className="glass-card w-full p-10 sm:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Sign In
            </h2>
            <p className="text-gray-500 text-sm">
              Welcome back to <span className="text-[#06BBCC] font-bold">CyberEdu</span>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-600 font-medium text-center mb-4">
                {error}
              </div>
            )}
            
            <div className="mb-2 flex justify-center">
              <Input
                label="Username"
                type="text"
                placeholder="Enter your username"
                className="w-full min-w-[380px]"
                {...register('taiKhoan')}
                error={errors.taiKhoan?.message}
              />
            </div>
            
            <div className="mb-2 flex justify-center">
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                className="w-full min-w-[380px]"
                {...register('matKhau')}
                error={errors.matKhau?.message}
              />
            </div>

            <div className="pt-8">
              <Button
                type="submit"
                className="w-full py-7 text-base rounded-xl font-bold shadow-lg shadow-[#06BBCC]/20"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </div>

            <p className="text-center text-gray-500 text-sm mt-10">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-bold text-[#06BBCC] hover:underline underline-offset-4"
              >
                Sign up for free
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
