'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle2, AlertCircle, Wifi } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const schema = z
  .object({
    email: z.string().email('Enter a valid email address'),
    phone: z
      .string()
      .regex(/^\+?[1-9]\d{6,14}$/, 'Enter a valid phone number (e.g. +12025550197)')
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });

type FormData = z.infer<typeof schema>;

// ─── Field Component ─────────────────────────────────────────────────────────

function Field({
  id, label, type = 'text', placeholder, error, optional, children,
  registration,
}: {
  id: string; label: string; type?: string; placeholder?: string;
  error?: string; optional?: boolean; children?: React.ReactNode;
  registration: ReturnType<ReturnType<typeof useForm<FormData>>['register']>;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
        {optional && <span className="text-xs font-normal text-zinc-400">(optional)</span>}
      </label>
      <input
        id={id} type={type} placeholder={placeholder}
        autoComplete={type === 'password' ? 'new-password' : undefined}
        {...registration}
        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1e6fd9] placeholder:text-zinc-400 transition"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const { api } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState<'success' | 'conflict' | 'error' | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setToast(null);
    try {
      await api.post('/auth/register', {
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
      });
      setToast('success');
      setTimeout(() => router.push('/login'), 1800);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      setToast(status === 409 ? 'conflict' : 'error');
    }
  };

  const toastConfig = {
    success: {
      icon: <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />,
      cls: 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400',
      msg: 'Account created! Redirecting to sign in…',
    },
    conflict: {
      icon: <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />,
      cls: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400',
      msg: 'An account with this email already exists.',
    },
    error: {
      icon: <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />,
      cls: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400',
      msg: 'Registration failed. Please try again.',
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 px-4 py-12">
      <div className="w-full max-w-md space-y-6">

        {/* Logo */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1e6fd9] shadow-lg shadow-[#1e6fd9]/30">
            <Wifi className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Telebey</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Create your account</p>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`flex gap-2.5 items-start text-sm border rounded-xl px-4 py-3 ${toastConfig[toast].cls}`}>
            {toastConfig[toast].icon}
            <span>{toastConfig[toast].msg}</span>
          </div>
        )}

        {/* Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-8 space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

            <Field id="reg-email" label="Email address" type="email"
              placeholder="you@example.com" error={errors.email?.message}
              registration={register('email')} />

            <Field id="reg-phone" label="Phone number" type="tel" optional
              placeholder="+12025550197" error={errors.phone?.message}
              registration={register('phone')} />

            <Field id="reg-password" label="Password" type="password"
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              error={errors.password?.message} registration={register('password')} />

            <Field id="reg-confirm" label="Confirm password" type="password"
              placeholder="••••••••" error={errors.confirm?.message}
              registration={register('confirm')} />

            <button
              type="submit"
              disabled={isSubmitting || toast === 'success'}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1e6fd9] hover:bg-[#1758b8] active:scale-[0.98] text-white text-sm font-semibold py-2.5 transition-all disabled:opacity-55 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Already have an account?{' '}
            <Link href="/login" className="text-[#1e6fd9] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-zinc-400">
          By registering you agree to our{' '}
          <Link href="/terms" className="hover:underline">Terms</Link>
          {' & '}
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
