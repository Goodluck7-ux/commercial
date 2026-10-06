import Link from 'next/link';
import { buttonClass, Card } from '@/components/ui';
import { HealthStatus } from '@/components/health-status';

const points = [
  {
    title: 'Vetted vendors',
    body: 'Every store is reviewed by our team before it goes live.',
  },
  {
    title: 'One checkout',
    body: 'Buy from several vendors in one cart and pay once.',
  },
  {
    title: 'A flat 5% fee',
    body: 'Vendors keep 95% of every sale. No monthly charges.',
  },
];

export default function Home() {
  return (
    <>
      <main className="mx-auto max-w-5xl px-5">
        <section className="py-16 sm:py-24">
          <p className="mb-5 inline-block rounded-full bg-soft px-3 py-1 text-sm font-medium text-brand">
            Many vendors, one marketplace
          </p>
          <h1 className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Sell your products to customers who are ready to buy.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Open a store in minutes, list your products, and get paid straight to your
            account when an order comes in.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/vendor" className={buttonClass('primary')}>Open your store</Link>
            <Link href="/sign-up" className={buttonClass('outline')}>Create an account</Link>
          </div>
        </section>

        <section className="grid gap-4 pb-20 sm:grid-cols-3">
          {points.map((p) => (
            <Card key={p.title}>
              <h2 className="font-semibold">{p.title}</h2>
              <p className="mt-2 text-sm text-muted">{p.body}</p>
            </Card>
          ))}
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
          <span className="text-xs text-muted">Nexus, built in Nigeria</span>
          <HealthStatus />
        </div>
      </footer>
    </>
  );
}