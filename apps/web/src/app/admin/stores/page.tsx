import { RequireAuth } from '@/components/require-auth';
import { AdminStoreQueue } from '@/components/admin-store-queue';

export default function AdminStoresPage() {
    return (
        <RequireAuth admin>
            <main className="mx-auto max-w-3xl px-5 py-10">
                <h1 className="text-3xl font-bold tracking-tight">Store applications</h1>
                <p className="mt-2 text-muted">Review new vendors and manage existing stores.</p>
                <div className="mt-8">
                    <AdminStoreQueue />
                </div>
            </main>
        </RequireAuth>
    );
}