import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2, ArrowLeft, ShoppingCart, Store, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

const fetchProductById = async (id) => {
    const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
    return data.product;
};

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mainImage, setMainImage] = useState(0);

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

    const hasImages = product.images && product.images.length > 0;
    const currentImageUrl = hasImages ? product.images[mainImage] : 'https://via.placeholder.com/600x400?text=No+Image';

    return (
        <div>
            <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', textDecoration: 'none', marginBottom: 'var(--spacing-6)', fontWeight: 'var(--font-weight-medium)' }}>
                <ArrowLeft size={20} /> Back to Products
            </Link>

            <div className="glass" style={{ padding: 'var(--spacing-8)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: 'var(--spacing-10)' }}>

                    {/* Image Gallery */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                        <div style={{
                            width: '100%',
                            height: '400px',
                            backgroundColor: 'var(--color-bg-base)',
                            borderRadius: 'var(--radius-lg)',
                            overflow: 'hidden',
                            boxShadow: 'inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.8)'
                        }}>
                            <img
                                src={currentImageUrl}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            />
                        </div>

                        {hasImages && product.images.length > 1 && (
                            <div style={{ display: 'flex', gap: 'var(--spacing-2)', overflowX: 'auto', paddingBottom: 'var(--spacing-2)' }}>
                                {product.images.map((img, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setMainImage(idx)}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            flexShrink: 0,
                                            borderRadius: 'var(--radius-md)',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            border: mainImage === idx ? '2px solid var(--color-accent)' : '2px solid transparent',
                                            boxShadow: '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.8)'
                                        }}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', marginBottom: 'var(--spacing-2)' }}>
                            {product.name}
                        </h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
                            <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-accent)' }}>
                                ${Number(product.price).toFixed(2)}
                            </span>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '16px',
                                fontSize: 'var(--font-size-sm)',
                                fontWeight: 'var(--font-weight-medium)',
                                backgroundColor: product.stock > 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: product.stock > 0 ? '#15803d' : '#b91c1c'
                            }}>
                                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                            </span>
                        </div>

                        <div style={{ whiteSpace: 'pre-line', color: 'var(--color-text)', lineHeight: 1.6, marginBottom: 'var(--spacing-8)' }}>
                            {product.description}
                        </div>

                        {/* Store Info */}
                        {product.store && (
                            <div style={{
                                backgroundColor: 'rgba(255,255,255,0.5)',
                                padding: 'var(--spacing-4)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: 'var(--spacing-8)',
                                border: '1px solid rgba(0,0,0,0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-4)'
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--color-accent)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Store size={24} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontWeight: 'var(--font-weight-bold)' }}>Sold by: {product.store.name}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
                                        <ShieldCheck size={14} className="text-green-600" /> Verified Seller
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: 'auto', display: 'flex', gap: 'var(--spacing-4)' }}>
                            <button
                                className="button-primary"
                                style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--spacing-2)', padding: 'var(--spacing-4)' }}
                                disabled={product.stock === 0}
                            >
                                <ShoppingCart size={20} />
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
