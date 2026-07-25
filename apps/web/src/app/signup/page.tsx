'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { api } from '../../lib/api';
import { useToast } from '../../components/ui/toast';
import { useAuth } from '../../providers/auth-provider';
import { User, Mail, Lock, UserPlus } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  role: z.enum(['ADMIN', 'MEMBER'] as const),
});

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const toast = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'MEMBER',
    },
  });

  const onSubmit = async (data: SignupValues) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/signup', data);
      toast.success('Account Created', `Welcome to TaskPulse, ${response.data.user.name}!`);
      login(response.data.accessToken, response.data.user);
    } catch (err: any) {
      toast.error('Signup Failed', err.message);
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
          <h1 className="text-2xl font-bold text-white tracking-tight">Create your account</h1>
          <p className="text-xs text-slate-400">Join TaskPulse to organize tasks and project workflows</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Alex Smith"
              leftIcon={<User className="w-4 h-4" />}
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="alex@example.com"
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

            <Select
              label="Account Role"
              options={[
                { label: 'Member (View & update assigned tasks)', value: 'MEMBER' },
                { label: 'Admin (Full management privileges)', value: 'ADMIN' },
              ]}
              error={errors.role?.message}
              {...register('role')}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              isLoading={loading}
              rightIcon={<UserPlus className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
