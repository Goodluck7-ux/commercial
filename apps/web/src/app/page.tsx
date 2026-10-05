import { HealthStatus } from '@/components/health-status';
import { SessionCard } from '@/components/session-card';

export default function Home() {
  return (
    <main className="mx-auto max-w-md p-10">
      <h1 className="mb-6 text-3xl font-bold">Commercial</h1>
      <HealthStatus />
      <SessionCard/>
    </main>
  );
}