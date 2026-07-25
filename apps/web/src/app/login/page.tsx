'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { api } from '../../lib/api';
import { useToast } from '../../components/ui/toast';
import { useAuth } from '../../providers/auth-provider';
import { Mail, Lock, LogIn } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const toast = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', data);
      toast.success('Welcome back!', `Logged in as ${response.data.user.name}`);
      login(response.data.accessToken, response.data.user);
    } catch (err: any) {
      toast.error('Authentication Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#090d16] via-[#0f172a] to-[#090d16]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-xl shadow-lg shadow-blue-500/25">
            T
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sign in to TaskPulse</h1>
          <p className="text-xs text-slate-400">Enter your credentials to access your task dashboard</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              isLoading={loading}
              rightIcon={<LogIn className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Quick Test Accounts</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
                <span className="font-semibold text-purple-400 block">ADMIN</span>
                <span className="block text-[11px] text-slate-400">admin@example.com</span>
                <span className="block text-[10px] text-slate-500">Password123!</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
                <span className="font-semibold text-blue-400 block">MEMBER</span>
                <span className="block text-[11px] text-slate-400">sarah@example.com</span>
                <span className="block text-[10px] text-slate-500">Password123!</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-400 font-semibold hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
