type Variant = 'primary' | 'outline' | 'ghost' | 'danger';

const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<Variant, string> = {
    primary: 'bg-brand text-brand-ink hover:opacity-90',
    outline: 'border border-line bg-surface text-ink hover:bg-soft',
    ghost: 'text-ink hover:bg-soft',
    danger: 'border border-line bg-surface text-bad hover:bg-bad-soft',
};

export function buttonClass(variant: Variant = 'primary') {
    return `${base} ${variants[variant]}`;
}

export function Button({
    variant = 'primary',
    className = '',
    ...props
}: React.ComponentProps<'button'> & { variant?: Variant }) {
    return <button className={`${buttonClass(variant)} ${className}`} {...props} />;
}

export function Card({ className = '', ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            className={`rounded-2xl border border-line bg-surface p-5 shadow-sm ${className}`}
            {...props}
        />
    );
}

export const inputClass =
    'w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/20';

export function Field({
    id,
    label,
    hint,
    children,
}: {
    id: string;
    label: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
                {label}
            </label>
            {children}
            {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
        </div>
    );
}

export function Skeleton({ className = '' }: { className?: string }) {
    return <div className={`animate-pulse rounded-xl bg-soft ${className}`} />;
}

export function StoreAvatar({ name }: { name: string }) {
    return (
        <div className="grid size-11 flex-none place-items-center rounded-xl bg-brand text-lg font-bold text-brand-ink">
            {name.charAt(0).toUpperCase()}
        </div>
    );
}