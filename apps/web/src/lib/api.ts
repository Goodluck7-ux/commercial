const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        ...init,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...init?.headers },
    });

    if (!res.ok) {
        let message = `Request failed (${res.status})`;
        try {
            const body = (await res.json()) as {
                message?: unknown;
                issues?: { message: string }[];
            };
            if (Array.isArray(body.issues) && body.issues.length > 0) {
                message = body.issues.map((i) => i.message).join(', ');
            } else if (typeof body.message === 'string') {
                message = body.message;
            }
        } catch {
            // response had no JSON body; keep the generic message
        }
        throw new ApiError(message, res.status);
    }

    return res.json() as Promise<T>;
}