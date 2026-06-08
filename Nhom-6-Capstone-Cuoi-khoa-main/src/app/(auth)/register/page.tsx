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
import { UserRegister } from '@/types/user';

const registerSchema = z.object({
  taiKhoan: z.string().min(1, 'Username is required'),
  matKhau: z.string()
    .min(8, 'Must be 8+ characters')
    .regex(/[A-Z]/, 'One uppercase required')
    .regex(/[0-9]/, 'One number required'),
  hoTen: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  soDT: z.string()
    .regex(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Invalid VN phone'),
  maNhom: z.string().min(1, 'Group ID required'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      maNhom: 'GP01',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      // Map fields exactly as required by API
      const payload: UserRegister = {
        taiKhoan: data.taiKhoan,
        matKhau: data.matKhau,
        hoTen: data.hoTen,
        soDT: data.soDT,
        maNhom: "GP01", // Strict mapping
        maLoaiNguoiDung: "HV",
        email: data.email
      };
      await authService.register(payload);
      router.push('/login');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response: { data: string } };
        setError(axiosError.response.data || 'Registration failed.');
      } else {
        setError('Network Error or API Issue. Please check console.');
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
        className="w-full max-w-2xl px-6 mx-auto"
      >
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-700 hover:text-[#06BBCC] mb-8 transition-colors group text-sm font-semibold tracking-wide"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="glass-card w-full p-10 sm:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-black mb-3 tracking-tighter uppercase">
              Join Us
            </h2>
            <p className="text-gray-500 text-sm">
              Create your <span className="text-[#06BBCC] font-bold">CyberEdu</span> account today
            </p>
          </div>

          <form className="space-y-4 px-4" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-600 font-medium text-center">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 place-items-center">
              <Input
                label="Username"
                type="text"
                placeholder="Pick a username"
                className="w-full min-w-[280px]"
                {...register('taiKhoan')}
                error={errors.taiKhoan?.message}
              />
              
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                className="w-full min-w-[280px]"
                {...register('matKhau')}
                error={errors.matKhau?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 place-items-center">
              <Input
                label="Full Name"
                type="text"
                placeholder="Your full name"
                className="w-full min-w-[280px]"
                {...register('hoTen')}
                error={errors.hoTen?.message}
              />

              <Input
                label="Phone Number"
                type="text"
                placeholder="09xx xxx xxx"
                className="w-full min-w-[280px]"
                {...register('soDT')}
                error={errors.soDT?.message}
              />
            </div>

            <div className="grid grid-cols-1 gap-2 place-items-center">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                className="min-w-[380px]"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>

            <div className="pt-6 px-4">
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </div>

            <p className="text-center text-gray-500 text-sm mt-8">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-bold text-[#06BBCC] hover:underline underline-offset-4"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
