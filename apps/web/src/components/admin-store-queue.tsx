'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useAdminStores, useSetStoreStatus, type StoreStatus } from '@/lib/stores';
import { Button, Card, Skeleton, StoreAvatar } from '@/components/ui';
import { StatusBadge } from './status-badge';

const TABS: StoreStatus[] = ['PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED'];

const ACTIONS: Record<
    StoreStatus,
    { label: string; to: StoreStatus; danger?: boolean; confirm?: string }[]
> = {
    PENDING: [
        { label: 'Approve', to: 'ACTIVE' },
        { label: 'Reject', to: 'REJECTED', danger: true, confirm: 'Reject this application?' },
    ],
    ACTIVE: [{ label: 'Suspend', to: 'SUSPENDED', danger: true, confirm: 'Suspend this store?' }],
    SUSPENDED: [{ label: 'Reinstate', to: 'ACTIVE' }],
    REJECTED: [],
};

export function AdminStoreQueue() {
    const [tab, setTab] = useState<StoreStatus>('PENDING');
    const { data, isPending, isError } = useAdminStores(tab);
    const setStatus = useSetStoreStatus();

    function change(id: string, to: StoreStatus, confirmText?: string) {
        if (confirmText && !window.confirm(confirmText)) return;
        setStatus.mutate(
            { id, status: to },
            {
                onSuccess: () => toast.success(`Store is now ${to.toLowerCase()}`),
                onError: (error) => toast.error(error.message),
            },
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2" role="tablist">
                {TABS.map((t) => (
                    <button
                        key={t}
                        role="tab"
                        aria-selected={tab === t}
                        onClick={() => setTab(t)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${tab === t
                                ? 'bg-brand text-brand-ink'
                                : 'border border-line bg-surface text-muted hover:text-ink'
                            }`}
                    >
                        {t.charAt(0) + t.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>

            {isPending && (
                <div className="space-y-3">
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                </div>
            )}
            {isError && <p className="text-sm text-bad">Could not load stores.</p>}
            {data && data.length === 0 && (
                <Card className="border-dashed text-center">
                    <p className="font-medium">Nothing here</p>
                    <p className="mt-1 text-sm text-muted">No stores with this status right now.</p>
                </Card>
            )}

            <ul className="space-y-3">
                {data?.map((store) => {
                    const owner = store.members[0]?.user;
                    return (
                        <li key={store.id}>
                            <Card>
                                <div className="flex items-start gap-4">
                                    <StoreAvatar name={store.name} />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold">{store.name}</p>
                                        <p className="text-sm text-muted">
                                            Applied {new Date(store.createdAt).toLocaleDateString()}
                                            {owner && `, ${owner.name} (${owner.email})`}
                                        </p>
                                        {store.description && <p className="mt-2 text-sm">{store.description}</p>}
                                    </div>
                                    <StatusBadge status={store.status} />
                                </div>

                                {ACTIONS[store.status].length > 0 && (
                                    <div className="mt-4 flex gap-2 border-t border-line pt-4">
                                        {ACTIONS[store.status].map((a) => (
                                            <Button
                                                key={a.label}
                                                variant={a.danger ? 'danger' : 'primary'}
                                                disabled={setStatus.isPending}
                                                onClick={() => change(store.id, a.to, a.confirm)}
                                            >
                                                {a.label}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}