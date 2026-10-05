'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

type Mode = 'sign-in' | 'sign-up';

export function AuthForm({ mode }: { mode: Mode }) {
    const router = useRouter();
    const isSignUp = mode === 'sign-up';
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submit = useMutation({
        mutationFn: async () => {
            const { error } = isSignUp
                ? await authClient.signUp.email({ name, email, password, role: 'user' })
                : await authClient.signIn.email({ email, password });
            if (error) throw new Error(error.message || 'Something went wrong');
        },
        onSuccess: () => {
            toast.success(isSignUp ? 'Account created' : 'Welcome back');
            router.push('/');
        },
        onError: (e: Error) => toast.error(e.message),
    });

    const input = 'w-full rounded-lg border px-3 py-2';

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                submit.mutate();
            }}
            className="space-y-4"
        >
            <h1 className="text-2xl font-bold">
                {isSignUp ? 'Create your account' : 'Sign in'}
            </h1>

            {isSignUp && (
                <div>
                    <label htmlFor="name" className="mb-1 block text-sm">Name</label>
                    <input
                        id="name"
                        className={input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
            )}

            <div>
                <label htmlFor="email" className="mb-1 block text-sm">Email</label>
                <input
                    id="email"
                    type="email"
                    className={input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="password" className="mb-1 block text-sm">Password</label>
                <input
                    id="password"
                    type="password"
                    className={input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                />
            </div>

            <button
                type="submit"
                disabled={submit.isPending}
                className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-60"
            >
                {submit.isPending ? 'Please wait...' : isSignUp ? 'Sign up' : 'Sign in'}
            </button>

            <p className="text-sm text-gray-500">
                {isSignUp ? 'Already have an account? ' : 'New here? '}
                <Link href={isSignUp ? '/sign-in' : '/sign-up'} className="underline">
                    {isSignUp ? 'Sign in' : 'Create an account'}
                </Link>
            </p>
        </form>
    );
}