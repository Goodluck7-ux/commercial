'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from './api';

export type StoreStatus = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';

export type MyStore = {
    role: 'OWNER' | 'MANAGER' | 'STAFF';
    store: {
        id: string;
        name: string;
        slug: string;
        status: StoreStatus;
        createdAt: string;
    };
};

export type AdminStore = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    status: StoreStatus;
    createdAt: string;
    members: { user: { name: string; email: string } }[];
};

export function useMyStores() {
    return useQuery({
        queryKey: ['stores', 'me'],
        queryFn: () => apiFetch<MyStore[]>('/stores/me'),
    });
}

export function useCreateStore() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: { name: string; description?: string }) =>
            apiFetch('/stores', { method: 'POST', body: JSON.stringify(input) }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stores', 'me'] }),
    });
}

export function useAdminStores(status: StoreStatus) {
    return useQuery({
        queryKey: ['admin', 'stores', status],
        queryFn: () => apiFetch<AdminStore[]>(`/admin/stores?status=${status}`),
    });
}

export function useSetStoreStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: StoreStatus }) =>
            apiFetch(`/admin/stores/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status }),
            }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'stores'] }),
    });
}