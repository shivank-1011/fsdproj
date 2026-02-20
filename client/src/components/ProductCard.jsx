import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    // Basic fallback if no image is available
    const imageUrl = product.images && product.images.length > 0
        ? product.images[0]
        : 'https://via.placeholder.com/300x200?text=No+Image';

    return (
        <Link
            to={`/products/${product.id}`}
            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
        >
            <div
                className="glass"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                }}
            >
                <div style={{
                    height: '200px',
                    width: '100%',
                    backgroundColor: 'var(--color-bg-base)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    borderBottom: '2px solid transparent',
                    borderRight: '2px solid rgba(255, 255, 255, 0.4)',
                    borderLeft: '2px solid rgba(0, 0, 0, 0.05)',
                    borderTop: '2px solid rgba(0, 0, 0, 0.05)',
                }}>
                    <img
                        src={imageUrl}
                        alt={product.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </div>

                <div style={{ padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{
                        fontSize: 'var(--font-size-lg)',
                        fontWeight: 'var(--font-weight-bold)',
                        marginBottom: 'var(--spacing-2)',
                        color: 'var(--color-primary)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        {product.name}
                    </h3>

                    <p style={{
                        color: 'var(--color-text-muted)',
                        fontSize: 'var(--font-size-sm)',
                        marginBottom: 'var(--spacing-4)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        flex: 1
                    }}>
                        {product.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <span style={{
                            fontSize: 'var(--font-size-xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-accent)'
                        }}>
                            ${Number(product.price).toFixed(2)}
                        </span>

                        {product.store && (
                            <span style={{
                                fontSize: 'var(--font-size-xs)',
                                color: 'var(--color-text-muted)',
                                backgroundColor: 'rgba(235, 94, 40, 0.1)',
                                padding: '4px 8px',
                                borderRadius: '12px'
                            }}>
                                {product.store.name}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
