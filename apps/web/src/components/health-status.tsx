'use client';

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';

type Health = { status: string; service: string; timestamp: string };

export function HealthStatus() {
    const { data, isPending, isError, refetch } = useQuery({
        queryKey: ['health'],
        queryFn: () => apiFetch<Health>('/health'),
    });

    async function recheck() {
        const result = await refetch();
        if (result.isError) toast.error('API is unreachable');
        else toast.success('API is healthy');
    }

    return (
        <div className="rounded-xl border p-6">
            <p className="text-sm text-gray-500">API status</p>
            <p className="text-2xl font-semibold">
                {isPending && 'Checking...'}
                {isError && 'Unreachable'}
                {data && `${data.service}: ${data.status}`}
            </p>
            {data && <p className="text-sm text-gray-500">{data.timestamp}</p>}
            <button
                onClick={recheck}
                className="mt-4 rounded-lg bg-black px-4 py-2 text-white"
            >
                Check again
            </button>
        </div>
    );
}