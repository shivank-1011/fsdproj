import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: 'var(--spacing-4)' }}>
            <header className="glass" style={{
                padding: 'var(--spacing-4)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-6)'
            }}>
                <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary-hover)' }}>App Name</h1>
                <nav>
                    {/* Navigation links will go here */}
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
