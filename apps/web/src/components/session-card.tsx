'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

export function SessionCard() {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) return <p className="mt-6 text-sm text-gray-500">Loading session...</p>;

    if (!session) {
        return (
            <div className="mt-6 flex gap-4 text-sm">
                <Link href="/sign-in" className="underline">Sign in</Link>
                <Link href="/sign-up" className="underline">Sign up</Link>
            </div>
        );
    }

    return (
        <div className="mt-6 rounded-xl border p-6">
            <p className="text-sm text-gray-500">Signed in</p>
            <p className="text-xl font-semibold">{session.user.name}</p>
            <p className="text-sm text-gray-500">
                {session.user.email} ({session.user.role})
            </p>

            <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <Link href="/vendor" className="underline">Sell on Commercial</Link>
                {session.user.role === 'admin' && (
                    <Link href="/admin/stores" className="underline">Store applications</Link>
                )}
            </div>
            <button
                onClick={async () => {
                    await authClient.signOut();
                    toast.success('Signed out');
                }}
                className="mt-4 rounded-lg border px-4 py-2"
            >
                Sign out
            </button>
        </div>
    );
}