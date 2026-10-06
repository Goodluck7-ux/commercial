'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { Button, buttonClass } from '@/components/ui';

const navLink =
    'rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-soft hover:text-ink';

export function SiteHeader() {
    const { data: session, isPending } = authClient.useSession();
    const isAdmin = session?.user.role === 'admin';

    return (
        <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-xl font-bold tracking-tight">
                        Nexus<span className="ml-0.5 inline-block size-2 rounded-full bg-accent" />
                    </Link>
                    <nav className="flex items-center">
                        <Link href="/vendor" className={navLink}>Sell</Link>
                        {isAdmin && <Link href="/admin/stores" className={navLink}>Admin</Link>}
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    {isPending ? null : session ? (
                        <>
                            <span className="hidden text-sm text-muted sm:inline">{session.user.name}</span>
                            <Button
                                variant="outline"
                                onClick={async () => {
                                    await authClient.signOut();
                                    toast.success('Signed out');
                                }}
                            >
                                Sign out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/sign-in" className={buttonClass('ghost')}>Sign in</Link>
                            <Link href="/sign-up" className={buttonClass('primary')}>Get started</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}