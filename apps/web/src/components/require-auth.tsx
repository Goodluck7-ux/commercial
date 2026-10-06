'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Skeleton } from '@/components/ui';

export function RequireAuth({
    children,
    admin = false,
}: {
    children: React.ReactNode;
    admin?: boolean;
}) {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (!isPending && !session) router.replace('/sign-in');
    }, [isPending, session, router]);

    if (isPending || !session) {
        return (
            <div className="mx-auto max-w-5xl space-y-4 px-5 py-10">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
            </div>
        );
    }

    if (admin && session.user.role !== 'admin') {
        return (
            <div className="mx-auto max-w-md px-5 py-20 text-center">
                <h1 className="text-xl font-bold">No access</h1>
                <p className="mt-2 text-sm text-muted">This page is for marketplace admins.</p>
            </div>
        );
    }

    return <>{children}</>;
}