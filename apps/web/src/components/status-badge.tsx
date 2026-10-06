import type { StoreStatus } from '@/lib/stores';

const styles: Record<StoreStatus, string> = {
    PENDING: 'bg-warn-soft text-warn',
    ACTIVE: 'bg-ok-soft text-ok',
    REJECTED: 'bg-bad-soft text-bad',
    SUSPENDED: 'bg-soft text-muted',
};

const labels: Record<StoreStatus, string> = {
    PENDING: 'Under review',
    ACTIVE: 'Active',
    REJECTED: 'Rejected',
    SUSPENDED: 'Suspended',
};

export function StatusBadge({ status }: { status: StoreStatus }) {
    return (
        <span
            className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
        >
            {labels[status]}
        </span>
    );
}