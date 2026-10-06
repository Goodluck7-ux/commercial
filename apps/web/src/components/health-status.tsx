'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

type Health = { status: string };

export function HealthStatus() {
    const { data, isPending, isError } = useQuery({
        queryKey: ['health'],
        queryFn: () => apiFetch<Health>('/health'),
        refetchInterval: 30000,
    });

    const ok = data?.status === 'ok';
    const label = isPending
        ? 'Checking system'
        : isError
            ? 'API unreachable'
            : ok
                ? 'All systems normal'
                : 'Database degraded';
    const dot = isPending ? 'bg-muted' : ok ? 'bg-ok' : 'bg-bad';

    return (
        <span className="inline-flex items-center gap-2 text-xs text-muted">
            <span className={`size-2 rounded-full ${dot}`} />
            {label}
        </span>
    );
}