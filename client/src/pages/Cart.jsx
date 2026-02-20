import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Loader2 } from 'lucide-react';
import { useCartStore } from '../context/cartStore';

const Cart = () => {
    const navigate = useNavigate();
    const { cart, isLoading, error, fetchCart, updateQuantity, removeFromCart, clearCart } = useCartStore();

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    if (isLoading && !cart) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <Loader2 className="animate-spin text-[#eb5e28]" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass" style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: 'var(--color-error)', margin: 'var(--spacing-6) auto', maxWidth: '600px' }}>
                <h3>Error loading cart</h3>
                <p>{error}</p>
                <button
                    onClick={() => fetchCart()}
                    className="button-primary"
                    style={{ marginTop: 'var(--spacing-4)' }}
                >
                    Retry
                </button>
            </div>
        );
    }

    const items = cart?.items || [];
    const subtotal = items.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax example
    const total = subtotal + tax;

    if (items.length === 0) {
        return (
            <div className="glass" style={{
                padding: 'var(--spacing-12)',
                textAlign: 'center',
                maxWidth: '600px',
                margin: 'var(--spacing-8) auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--spacing-4)'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(235, 94, 40, 0.1)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'var(--color-primary)'
                }}>
                    <ShoppingBag size={40} />
                </div>
                <h2 style={{ fontSize: 'var(--font-size-2xl)', color: 'var(--color-text)' }}>Your cart is empty</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-4)' }}>
                    Looks like you haven't added anything to your cart yet.
                </p>
                <Link
                    to="/products"
                    className="button-primary"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div style={{ padding: 'var(--spacing-4)' }}>
            <h1 style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-primary)',
                marginBottom: 'var(--spacing-6)'
            }}>
                Shopping Cart
            </h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)',
                gap: 'var(--spacing-8)',
                alignItems: 'start'
            }}>
                {/* Cart Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                    {items.map((item) => (
                        <div key={item.id} className="glass" style={{
                            display: 'flex',
                            padding: 'var(--spacing-4)',
                            gap: 'var(--spacing-4)',
                            alignItems: 'center'
                        }}>
                            {/* Product Image */}
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                flexShrink: 0,
                                backgroundColor: 'rgba(255,255,255,0.5)'
                            }}>
                                <img
                                    src={item.product.images?.[0] || 'https://via.placeholder.com/100?text=No+Image'}
                                    alt={item.product.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>

                            {/* Product Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <Link to={`/products/${item.product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <h3 style={{
                                        fontSize: 'var(--font-size-lg)',
                                        fontWeight: 'var(--font-weight-bold)',
                                        color: 'var(--color-text)',
                                        marginBottom: 'var(--spacing-1)',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {item.product.name}
                                    </h3>
                                </Link>
                                <p className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                                    Price: ₹{Number(item.product.price).toFixed(2)}
                                </p>

                                {/* Controls */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-3)',
                                        backgroundColor: 'rgba(255,255,255,0.4)',
                                        padding: '4px 8px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid rgba(0,0,0,0.05)'
                                    }}>
                                        <button
                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                            disabled={item.quantity <= 1}
                                            className="button-icon"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span style={{ fontWeight: 'var(--font-weight-medium)', minWidth: '20px', textAlign: 'center' }}>
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            disabled={item.quantity >= item.product.stock}
                                            className="button-icon"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="button-icon danger"
                                        style={{ fontSize: 'var(--font-size-sm)', gap: 'var(--spacing-1)' }}
                                    >
                                        <Trash2 size={16} />
                                        <span className="hidden sm:inline">Remove</span>
                                    </button>
                                </div>
                            </div>

                            {/* Item Total */}
                            <span className="font-bold" style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text)' }}>
                                ₹{(Number(item.product.price) * item.quantity).toFixed(2)}
                            </span>
                        </div>
                    ))}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-2)' }}>
                        <button
                            onClick={clearCart}
                            className="button-text"
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="glass" style={{
                    padding: 'var(--spacing-6)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-4)',
                    position: 'sticky',
                    top: '80px'
                }}>
                    <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)' }}>
                        Order Summary
                    </h2>

                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                        <span>Subtotal ({items.length} items)</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                        <span>Tax (10%)</span>
                        <span>₹{tax.toFixed(2)}</span>
                    </div>

                    <div style={{
                        height: '1px',
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        margin: 'var(--spacing-2) 0'
                    }} />

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 'var(--font-size-xl)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-text)'
                    }}>
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={() => navigate('/checkout')}
                        className="button-primary"
                        style={{ marginTop: 'var(--spacing-4)', width: '100%' }}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
