import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Store, Package, LogOut } from 'lucide-react';
import InteractiveBackground from '../components/InteractiveBackground';
import { useAuthStore } from '../context/authStore';

const SellerLayout = () => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navItems = [
        { path: '/seller', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/seller/products', label: 'Products', icon: Package },
        { path: '/', label: 'Back to Store', icon: Store }
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <InteractiveBackground />

            {/* Sidebar */}
            <aside className="glass" style={{
                width: '260px',
                padding: 'var(--spacing-6)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-8)',
                borderRight: '1px solid rgba(255, 255, 255, 0.2)',
                zIndex: 10
            }}>
                <div>
                    <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
                        Seller Dashboard
                    </h1>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', flex: 1 }}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || (item.path !== '/' && item.path !== '/seller' && location.pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-3)',
                                    padding: '10px 16px',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    color: isActive ? '#ffffff' : 'var(--color-text)',
                                    backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                                    fontWeight: isActive ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <Icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-3)',
                        padding: '10px 16px',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--color-text)',
                        cursor: 'pointer',
                        fontSize: 'var(--font-size-md)',
                        fontWeight: 'var(--font-weight-medium)',
                    }}
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: 'var(--spacing-8)', overflowY: 'auto', zIndex: 10 }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default SellerLayout;
