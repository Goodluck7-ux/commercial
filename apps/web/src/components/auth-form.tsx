'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { Button, Card, Field, inputClass } from '@/components/ui';

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
                ? await authClient.signUp.email({ name, email, password, role: 'customer' })
                : await authClient.signIn.email({ email, password });
            if (error) throw new Error(error.message || 'Something went wrong');
        },
        onSuccess: () => {
            toast.success(isSignUp ? 'Account created' : 'Welcome back');
            router.push('/');
        },
        onError: (e: Error) => toast.error(e.message),
    });

    return (
        <Card className="p-7">
            <h1 className="text-2xl font-bold tracking-tight">
                {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="mt-1 text-sm text-muted">
                {isSignUp
                    ? 'Shop, or apply to open your own store.'
                    : 'Sign in to manage your account and stores.'}
            </p>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    submit.mutate();
                }}
                className="mt-6 space-y-4"
            >
                {isSignUp && (
                    <Field id="name" label="Full name">
                        <input
                            id="name"
                            className={inputClass}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                            required
                        />
                    </Field>
                )}

                <Field id="email" label="Email">
                    <input
                        id="email"
                        type="email"
                        className={inputClass}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />
                </Field>

                <Field id="password" label="Password" hint={isSignUp ? 'At least 8 characters.' : undefined}>
                    <input
                        id="password"
                        type="password"
                        className={inputClass}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={isSignUp ? 'new-password' : 'current-password'}
                        minLength={8}
                        required
                    />
                </Field>

                <Button type="submit" disabled={submit.isPending} className="w-full">
                    {submit.isPending ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
                {isSignUp ? 'Already have an account? ' : 'New here? '}
                <Link
                    href={isSignUp ? '/sign-in' : '/sign-up'}
                    className="font-medium text-brand hover:underline"
                >
                    {isSignUp ? 'Sign in' : 'Create an account'}
                </Link>
            </p>
        </Card>
    );
}