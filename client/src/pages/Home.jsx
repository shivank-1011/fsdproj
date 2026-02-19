const Home = () => {
    return (
        <div>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-4)' }}>Welcome to the Glass UI</h2>
            <p style={{ marginBottom: 'var(--spacing-6)' }}>This is the home page demonstrating the glassmorphism effect.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
                <div className="glass" style={{ padding: 'var(--spacing-6)' }}>
                    <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-2)' }}>Card 1</h3>
                    <p>This card uses the glass utility class. Notice the blur and transparency.</p>
                </div>
                <div className="glass" style={{ padding: 'var(--spacing-6)' }}>
                    <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-2)' }}>Card 2</h3>
                    <p>Another glass card to show the layout.</p>
                </div>
                <div className="glass" style={{ padding: 'var(--spacing-6)' }}>
                    <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--spacing-2)' }}>Card 3</h3>
                    <p>Glassmorphism works best with a colorful background!</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
