import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, ShoppingCart, User } from 'lucide-react';
import { useEffect } from 'react';
import { useCartStore } from '../context/cartStore';

import InteractiveBackground from '../components/InteractiveBackground';

const MainLayout = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const { cart, fetchCart } = useCartStore();

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery(''); // Optional: clear search after submitting
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: 'var(--spacing-4)' }}>
            <InteractiveBackground />
            <header className="glass" style={{
                padding: 'var(--spacing-4)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-6)',
                gap: 'var(--spacing-6)'
            }}>
                {/* Logo / App Name */}
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', margin: 0 }}>
                        UnityMart
                    </h1>
                </Link>

                {/* Global Search Bar */}
                <form
                    onSubmit={handleSearch}
                    style={{
                        flex: 1,
                        maxWidth: '500px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <Search
                        size={18}
                        style={{
                            position: 'absolute',
                            left: '12px',
                            color: 'var(--color-text-muted)'
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 16px 10px 40px',
                            border: 'none',
                            borderRadius: '24px',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            color: 'var(--color-text)',
                            fontSize: 'var(--font-size-md)',
                            boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.8)',
                            outline: 'none',
                        }}
                    />
                </form>

                {/* Navigation */}
                <nav style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'center' }}>
                    <Link to="/products" style={{ textDecoration: 'none', color: 'var(--color-text)', fontWeight: 'var(--font-weight-medium)' }}>
                        Products
                    </Link>
                    <Link to="/cart" style={{ textDecoration: 'none', color: 'var(--color-text)', position: 'relative' }}>
                        <ShoppingCart size={24} />
                        {cartItemCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                backgroundColor: 'var(--color-primary)',
                                color: '#ffffff',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                borderRadius: 'var(--radius-full)',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}>
                                {cartItemCount > 99 ? '99+' : cartItemCount}
                            </span>
                        )}
                    </Link>
                    {/* Add User profile link if needed here */}
                </nav>
            </header>

            <main className="glass" style={{ flex: 1, padding: 'var(--spacing-6)', maxWidth: '1200px', margin: '0 auto', width: '100%', marginBottom: 'var(--spacing-6)' }}>
                <Outlet />
            </main>

            <footer className="glass" style={{
                padding: 'var(--spacing-4)',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
            }}>
                <p>&copy; {new Date().getFullYear()} App Name. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default MainLayout;
