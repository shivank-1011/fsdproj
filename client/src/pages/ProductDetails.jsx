import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ArrowLeft, ShoppingCart, Store, ShieldCheck, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../context/cartStore';
import api from '../lib/axios';

const fetchProductById = async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data.product;
};

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mainImage, setMainImage] = useState(0);
    const { cart, addToCart, removeFromCart, updateQuantity } = useCartStore();
    const [isAdding, setIsAdding] = useState(false);

    const { data: product, isLoading, isError, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProductById(id),
    });

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Loader2 className="animate-spin text-[#eb5e28]" size={48} />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="glass" style={{ padding: 'var(--spacing-12)', textAlign: 'center', color: '#ef4444' }}>
                <h3 style={{ fontSize: 'var(--font-size-xl)' }}>Error Loading Product</h3>
                <p>{error.message}</p>
                <button onClick={() => navigate('/products')} className="button-primary" style={{ marginTop: 'var(--spacing-4)' }}>
                    Back to Products
                </button>
            </div>
        );
    }

    if (!product) return null;

    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            await addToCart(product.id, 1);
        } catch (error) {
            console.error("Failed to add to cart:", error);
        } finally {
            setIsAdding(false);
        }
    };

    const hasImages = product.images && product.images.length > 0;
    const currentImageUrl = hasImages ? product.images[mainImage] : 'https://via.placeholder.com/600x400?text=No+Image';

    const cartItem = cart?.items?.find((item) => item.productId === product.id);

    return (
        <div>
            <Link
                to="/products"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--color-text-muted)',
                    textDecoration: 'none',
                    marginBottom: 'var(--spacing-6)',
                    fontWeight: 'var(--font-weight-medium)',
                    transition: 'color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
                <ArrowLeft size={20} /> Back to Products
            </Link>

            <div className="glass" style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: 'var(--spacing-8)',
                borderRadius: 'var(--radius-xl)'
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--spacing-10)', alignItems: 'start' }}>

                    {/* Left Column: Image Gallery */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
                        <div style={{
                            width: '100%',
                            aspectRatio: '1 / 1',
                            backgroundColor: 'rgba(255,255,255,0.4)', // Soft white background to ground the image
                            borderRadius: 'var(--radius-xl)',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)',
                            border: '1px solid rgba(255,255,255,0.5)',
                            padding: 'var(--spacing-6)'
                        }}>
                            <img
                                src={currentImageUrl}
                                alt={product.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain', // Keep image fully visible
                                    mixBlendMode: 'multiply' // Helps blend white background images into the container
                                }}
                            />
                        </div>

                        {hasImages && product.images.length > 1 && (
                            <div style={{ display: 'flex', gap: 'var(--spacing-4)', overflowX: 'auto', paddingBottom: 'var(--spacing-2)' }}>
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setMainImage(idx)}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            flexShrink: 0,
                                            borderRadius: 'var(--radius-lg)',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            padding: 0,
                                            backgroundColor: 'transparent',
                                            border: mainImage === idx ? '2px solid var(--color-primary)' : '2px solid var(--color-border)',
                                            transition: 'all 0.2s ease',
                                            opacity: mainImage === idx ? 1 : 0.7
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                                        onMouseOut={(e) => {
                                            if (mainImage !== idx) e.currentTarget.style.opacity = 0.7;
                                        }}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Product Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', paddingTop: 'var(--spacing-4)' }}>

                        {/* Store Info Pill (Moved to top for better hierarchy) */}
                        {product.store && (
                            <Link to={`/stores/${product.store.id}`} style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-2)',
                                    padding: '6px 14px',
                                    backgroundColor: 'rgba(235, 94, 40, 0.08)',
                                    border: '1px solid rgba(235, 94, 40, 0.2)',
                                    borderRadius: 'var(--radius-full)',
                                    marginBottom: 'var(--spacing-4)',
                                    transition: 'background-color 0.2s'
                                }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(235, 94, 40, 0.15)'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(235, 94, 40, 0.08)'}
                                >
                                    <Store size={14} color="var(--color-primary)" />
                                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
                                        {product.store.name}
                                    </span>
                                    <ShieldCheck size={14} color="#15803d" />
                                </div>
                            </Link>
                        )}

                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-text)',
                            marginBottom: 'var(--spacing-2)',
                            lineHeight: 1.2,
                            letterSpacing: '-0.02em'
                        }}>
                            {product.name}
                        </h1>

                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)', marginTop: 'var(--spacing-4)' }}>
                            <span style={{
                                fontSize: '2.5rem',
                                fontWeight: 'var(--font-weight-bold)',
                                color: 'var(--color-text)',
                                lineHeight: 1
                            }}>
                                ₹{Number(product.price).toFixed(2)}
                            </span>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: 'var(--font-size-sm)',
                                fontWeight: 'var(--font-weight-bold)',
                                backgroundColor: product.stock > 0 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: product.stock > 0 ? '#15803d' : '#b91c1c',
                                border: product.stock > 0 ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                                marginBottom: '4px'
                            }}>
                                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Divider */}
                        <div style={{ height: '1px', backgroundColor: 'var(--color-border)', opacity: 0.5, marginBottom: 'var(--spacing-8)' }} />

                        <div style={{
                            color: 'var(--color-text-muted)',
                            lineHeight: 1.8,
                            marginBottom: 'var(--spacing-10)',
                            fontSize: 'var(--font-size-base)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--spacing-4)'
                        }}>
                            {/* Simple markdown-like rendering for description */}
                            {product.description.split('\n\n').map((paragraph, i) => {
                                if (paragraph.includes('\n-')) {
                                    // Handle lists
                                    const [intro, ...items] = paragraph.split('\n-');
                                    return (
                                        <div key={i}>
                                            {intro && <p style={{ marginBottom: 'var(--spacing-2)' }}>{intro}</p>}
                                            <ul style={{ listStyleType: 'disc', paddingLeft: 'var(--spacing-6)', margin: 0 }}>
                                                {items.map((item, j) => (
                                                    <li key={j} style={{ marginBottom: '4px' }}>{item.trim()}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                }
                                return <p key={i} style={{ margin: 0 }}>{paragraph}</p>;
                            })}
                        </div>

                        <div style={{ marginTop: 'auto', display: 'flex', gap: 'var(--spacing-4)' }}>
                            {cartItem ? (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    maxWidth: '400px',
                                    padding: '8px',
                                    backgroundColor: 'rgba(255,255,255,0.4)',
                                    borderRadius: 'var(--radius-full)',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                                }}>
                                    <button
                                        onClick={() => {
                                            if (cartItem.quantity <= 1) {
                                                removeFromCart(cartItem.id);
                                            } else {
                                                updateQuantity(cartItem.id, cartItem.quantity - 1);
                                            }
                                        }}
                                        className="button-icon"
                                        style={{ padding: '16px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-surface)' }}
                                    >
                                        <Minus size={24} />
                                    </button>
                                    <span style={{ 
                                        fontSize: 'var(--font-size-xl)', 
                                        fontWeight: 'var(--font-weight-bold)',
                                        color: 'var(--color-text)',
                                        minWidth: '40px',
                                        textAlign: 'center'
                                    }}>
                                        {cartItem.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                                        disabled={cartItem.quantity >= product.stock}
                                        className="button-icon"
                                        style={{ padding: '16px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-surface)' }}
                                    >
                                        <Plus size={24} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0 || isAdding}
                                    className="button-primary"
                                    style={{
                                        flex: 1,
                                        maxWidth: '400px',
                                        padding: '18px 32px',
                                        fontSize: 'var(--font-size-lg)',
                                        borderRadius: 'var(--radius-full)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}
                                >
                                    {isAdding ? (
                                        <Loader2 className="animate-spin" size={24} />
                                    ) : (
                                        <ShoppingCart size={24} />
                                    )}
                                    {product.stock === 0 ? 'Out of Stock' : (isAdding ? 'Adding...' : 'Add to Cart')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
