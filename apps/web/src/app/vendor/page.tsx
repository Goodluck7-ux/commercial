import { RequireAuth } from '@/components/require-auth';
import { ApplyStoreForm } from '@/components/apply-store-form';
import { MyStores } from '@/components/my-stores';

export default function VendorPage() {
    return (
        <RequireAuth>
            <main className="mx-auto max-w-5xl px-5 py-10">
                <h1 className="text-3xl font-bold tracking-tight">Sell on Nexus</h1>
                <p className="mt-2 max-w-xl text-muted">
                    Apply to open a store, then track its status here.
                </p>

                <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
                    <section>
                        <h2 className="mb-3 text-lg font-semibold">Your stores</h2>
                        <MyStores />
                    </section>
                    <ApplyStoreForm />
                </div>
            </main>
        </RequireAuth>
    );
}