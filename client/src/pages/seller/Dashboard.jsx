import { useEffect } from 'react';
import { useStoreStore } from '../../context/storeStore';
import { Link, useNavigate } from 'react-router-dom';
import { LoadingState, EmptyState } from '../../components/UIState';
import { Store } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();
    const { fetchMyStore, store, isLoading } = useStoreStore();

    useEffect(() => {
        fetchMyStore().catch(() => { });
    }, [fetchMyStore]);

    if (isLoading) {
        return <LoadingState message="Loading your dashboard..." fullHeight />;
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
                    <div style={{ marginTop: 'var(--spacing-6)', display: 'flex', gap: 'var(--spacing-4)' }}>
                        <Link to="/seller/products" className="button-primary" style={{ textDecoration: 'none', display: 'inline-block', padding: '10px 20px', borderRadius: 'var(--radius-md)' }}>
                            Manage Products
                        </Link>
                    </div>
                </div>
            ) : (
                <EmptyState
                    title="No Store Found"
                    message="You have not set up a store yet. Please create one to start selling!"
                    icon={Store}
                    actionLabel="Create Store"
                    onAction={() => navigate('/seller/store-setup')}
                />
            )}
        </div>
    );
}
