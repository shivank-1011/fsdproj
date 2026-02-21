import { useEffect } from 'react';
import { useStoreStore } from '../../context/storeStore';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
    const { fetchMyStore, store, isLoading } = useStoreStore();

    useEffect(() => {
        fetchMyStore().catch(() => { });
    }, [fetchMyStore]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-8)' }}>
                <Loader2 className="animate-spin" style={{ color: 'var(--color-primary)' }} size={32} />
            </div>
        );
    }

    return (
        <div className="glass" style={{ padding: 'var(--spacing-6)', borderRadius: 'var(--radius-xl)' }}>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-4)', color: 'var(--color-primary)' }}>
                Dashboard
            </h2>
            {store ? (
                <div>
                    <p style={{ fontSize: 'var(--font-size-lg)' }}>Welcome to your store dashboard, <strong>{store.name}</strong>!</p>
                    <p style={{ marginTop: 'var(--spacing-2)', color: 'var(--color-text-muted)' }}>
                        Status: {store.isVerified ? 'Verified' : 'Pending Verification'}
                    </p>
                </div>
            ) : (
                <div>
                    <p style={{ fontSize: 'var(--font-size-lg)' }}>You have not set up a store yet. Please create one to start selling!</p>
                </div>
            )}
        </div>
    );
}
