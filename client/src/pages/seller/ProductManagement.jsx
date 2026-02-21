import { useState, useEffect } from 'react';
import { useStoreStore } from '../../context/storeStore';
import { useProductStore } from '../../context/productStore';
import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';

export default function ProductManagement() {
    const { store, fetchMyStore, isLoading: isStoreLoading } = useStoreStore();
    const { createProduct, updateProduct, deleteProduct, isLoading: isProductLoading, error } = useProductStore();

    const [view, setView] = useState('list'); // 'list', 'create', 'edit'
    const [editingProduct, setEditingProduct] = useState(null);

    // Form states
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [images, setImages] = useState([]); // File objects for creation
    const [previewUrls, setPreviewUrls] = useState([]); // Existing URLs for editing

    useEffect(() => {
        if (!store) {
            fetchMyStore().catch(() => { });
        }
    }, [store, fetchMyStore]);

    const resetForm = () => {
        setName('');
        setDescription('');
        setPrice('');
        setStock('');
        setImages([]);
        setPreviewUrls([]);
        setEditingProduct(null);
        setView('list');
    };

    const handleEdit = (product) => {
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price);
        setStock(product.stock);
        setPreviewUrls(product.images || []);
        setImages([]); // Current backend PUT only handles JSON, not multipart files
        setEditingProduct(product);
        setView('edit');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
            await fetchMyStore(); // Refresh list
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (view === 'create') {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('description', description);
                formData.append('price', price);
                formData.append('stock', stock);
                images.forEach(img => formData.append('images', img));

                await createProduct(formData);
            } else if (view === 'edit') {
                await updateProduct(editingProduct.id, {
                    name,
                    description,
                    price: parseFloat(price),
                    stock: parseInt(stock, 10),
                    images: previewUrls, // Keeping existing images
                });
            }
            await fetchMyStore(); // Refresh
            resetForm();
        } catch (err) {
            console.error(err);
        }
    };

    if (isStoreLoading && !store) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-8)' }}><Loader2 className="animate-spin" style={{ color: 'var(--color-primary)' }} size={32} /></div>;
    }

    if (!store) {
        return (
            <div className="glass" style={{ padding: 'var(--spacing-6)', borderRadius: 'var(--radius-xl)' }}>
                <p style={{ fontSize: 'var(--font-size-lg)' }}>Please create a store first to manage products.</p>
            </div>
        );
    }

    return (
        <div className="glass" style={{ padding: 'var(--spacing-6)', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
                <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
                    Products & Stock
                </h2>
                {view === 'list' && (
                    <button
                        className="button-primary"
                        onClick={() => { resetForm(); setView('create'); }}
                    >
                        <Plus size={20} /> Add Product
                    </button>
                )}
            </div>

            {error && <div style={{ color: 'var(--color-error)', marginBottom: 'var(--spacing-4)' }}>{error}</div>}

            {view !== 'list' ? (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)', background: 'rgba(255,255,255,0.2)', padding: 'var(--spacing-6)', borderRadius: 'var(--radius-lg)' }}>
                    <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>
                        {view === 'create' ? 'Create New Product' : 'Edit Product'}
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)' }}>Name</label>
                            <input required type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: 'none', outline: 'none' }} className="glass" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)' }}>Price ($)</label>
                            <input required type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: 'none', outline: 'none' }} className="glass" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)' }}>Stock</label>
                            <input required type="number" value={stock} onChange={(e) => setStock(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: 'none', outline: 'none' }} className="glass" />
                        </div>
                        {view === 'create' && (
                            <div>
                                <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)' }}>Images</label>
                                <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: 'none', outline: 'none' }} className="glass" />
                            </div>
                        )}
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: 'var(--font-size-sm)' }}>Description</label>
                        <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: 'none', outline: 'none' }} className="glass" />
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-2)' }}>
                        <button type="submit" className="button-primary" disabled={isProductLoading}>
                            {isProductLoading ? 'Saving...' : 'Save Product'}
                        </button>
                        <button type="button" className="button-secondary" onClick={resetForm} disabled={isProductLoading}>
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                    {(!store.products || store.products.length === 0) ? (
                        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--spacing-8)', fontStyle: 'italic' }}>
                            No products found. Add some to get started!
                        </p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <th style={{ padding: 'var(--spacing-3)' }}>Image</th>
                                        <th style={{ padding: 'var(--spacing-3)' }}>Name</th>
                                        <th style={{ padding: 'var(--spacing-3)' }}>Price</th>
                                        <th style={{ padding: 'var(--spacing-3)' }}>Stock</th>
                                        <th style={{ padding: 'var(--spacing-3)' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {store.products.map(product => (
                                        <tr key={product.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                                            <td style={{ padding: 'var(--spacing-3)' }}>
                                                {product.images?.[0] ? (
                                                    <img src={product.images[0]} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                                                ) : (
                                                    <div style={{ width: '50px', height: '50px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <ImageIcon size={20} color="var(--color-text-muted)" />
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: 'var(--spacing-3)', fontWeight: 'var(--font-weight-medium)' }}>{product.name}</td>
                                            <td style={{ padding: 'var(--spacing-3)' }}>${parseFloat(product.price).toFixed(2)}</td>
                                            <td style={{ padding: 'var(--spacing-3)' }}>
                                                <span style={{
                                                    padding: '4px 8px',
                                                    borderRadius: 'var(--radius-full)',
                                                    fontSize: 'var(--font-size-sm)',
                                                    backgroundColor: product.stock > 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                    color: product.stock > 0 ? 'var(--color-success)' : 'var(--color-error)',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td style={{ padding: 'var(--spacing-3)' }}>
                                                <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                                                    <button onClick={() => handleEdit(product)} className="button-icon" title="Edit">
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button onClick={() => handleDelete(product.id)} className="button-icon danger" title="Delete">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
