'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useCreateStore } from '@/lib/stores';
import { Button, Card, Field, inputClass } from '@/components/ui';

export function ApplyStoreForm() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const createStore = useCreateStore();

    return (
        <Card>
            <h2 className="text-lg font-semibold">Apply to open a store</h2>
            <p className="mt-1 text-sm text-muted">
                Tell us about your business. We review every application.
            </p>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    createStore.mutate(
                        { name, description: description || undefined },
                        {
                            onSuccess: () => {
                                toast.success('Application submitted. We will review it soon.');
                                setName('');
                                setDescription('');
                            },
                            onError: (error) => toast.error(error.message),
                        },
                    );
                }}
                className="mt-5 space-y-4"
            >
                <Field id="store-name" label="Store name">
                    <input
                        id="store-name"
                        className={inputClass}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        minLength={3}
                        maxLength={60}
                        required
                    />
                </Field>

                <Field id="store-desc" label="What do you sell?" hint="Optional, up to 500 characters.">
                    <textarea
                        id="store-desc"
                        className={inputClass}
                        rows={4}
                        maxLength={500}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Field>

                <Button type="submit" disabled={createStore.isPending} className="w-full">
                    {createStore.isPending ? 'Submitting...' : 'Submit application'}
                </Button>
            </form>
        </Card>
    );
}