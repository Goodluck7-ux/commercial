'use client';

import { useMyStores, type StoreStatus } from '@/lib/stores';
import { Card, Skeleton, StoreAvatar } from '@/components/ui';
import { StatusBadge } from './status-badge';

const hints: Record<StoreStatus, string> = {
    PENDING: 'We are reviewing your application.',
    ACTIVE: 'Your store is live.',
    REJECTED: 'This application was not approved.',
    SUSPENDED: 'This store is paused. Contact support.',
};

export function MyStores() {
    const { data, isPending, isError } = useMyStores();

    if (isPending) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
            </div>
        );
    }

    if (isError) {
        return <p className="text-sm text-bad">Could not load your stores. Try refreshing.</p>;
    }

    if (data.length === 0) {
        return (
            <Card className="border-dashed text-center">
                <p className="font-medium">No stores yet</p>
                <p className="mt-1 text-sm text-muted">
                    Submit an application and it will show up here.
                </p>
            </Card>
        );
    }

    return (
        <ul className="space-y-3">
            {data.map(({ store, role }) => (
                <li key={store.id}>
                    <Card className="flex items-center gap-4">
                        <StoreAvatar name={store.name} />
                        <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold">{store.name}</p>
                            <p className="truncate text-sm text-muted">
                                {hints[store.status]} <span className="capitalize">({role.toLowerCase()})</span>
                            </p>
                        </div>
                        <StatusBadge status={store.status} />
                    </Card>
                </li>
            ))}
        </ul>
    );
}