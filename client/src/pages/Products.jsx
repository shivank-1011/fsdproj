import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import api from '../lib/axios';

import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';

// Fetch products function
const fetchProducts = async (params) => {
    // Clean up empty params
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v != null && v !== '')
    );
    const { data } = await api.get('/products', { params: cleanParams });
    return data;
};

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize filters from URL
    const getInitialFilters = () => ({
        search: searchParams.get('search') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sortBy: searchParams.get('sortBy') || '',
        order: searchParams.get('order') || 'asc',
        page: parseInt(searchParams.get('page')) || 1,
        limit: 12
    });

    const [filters, setFilters] = useState(getInitialFilters());

    // Update URL when filters change (debounce to prevent too many re-renders/pushes)
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentParams = {};
            if (filters.search) currentParams.search = filters.search;
            if (filters.minPrice) currentParams.minPrice = filters.minPrice;
            if (filters.maxPrice) currentParams.maxPrice = filters.maxPrice;
            if (filters.sortBy) currentParams.sortBy = filters.sortBy;
            if (filters.order !== 'asc') currentParams.order = filters.order;
            if (filters.page > 1) currentParams.page = filters.page.toString();

            setSearchParams(currentParams, { replace: true });
        }, 500);

        return () => clearTimeout(timer);
    }, [filters, setSearchParams]);

    // Query for products
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['products', filters],
        queryFn: () => fetchProducts(filters),
        keepPreviousData: true, // Keep old data while fetching new (for smooth pagination)
    });

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 })); // Reset to page 1 on filter change
    };

    const handleReset = () => {
        setFilters({
            search: '',
            minPrice: '',
            maxPrice: '',
            sortBy: '',
            order: 'asc',
            page: 1,
            limit: 12
        });
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={{ display: 'flex', gap: 'var(--spacing-8)', flexDirection: 'row', alignItems: 'flex-start' }}>

            {/* Main Content (Products List) */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-6)' }}>
                    <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
                        All Products
                    </h1>
                    {data && (
                        <span style={{ color: 'var(--color-text-muted)' }}>
                            Showing {data.products.length} of {data.total} results
                        </span>
                    )}
                </div>

                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-12)' }}>
                        <Loader2 className="animate-spin text-[#eb5e28]" size={48} />
                    </div>
                ) : isError ? (
                    <div className="glass" style={{ padding: 'var(--spacing-6)', textAlign: 'center', color: '#ef4444' }}>
                        Error loading products: {error.message}
                    </div>
                ) : !data || data.products.length === 0 ? (
                    <div className="glass" style={{ padding: 'var(--spacing-12)', textAlign: 'center' }}>
                        <h3 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-2)' }}>No products found</h3>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-4)' }}>Try adjusting your filters or search criteria.</p>
                        <button onClick={handleReset} className="button-primary">Clear Filters</button>
                    </div>
                ) : (
                    <>
                        {/* Products Grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: 'var(--spacing-6)'
                        }}>
                            {data.products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {data.totalPages > 1 && (
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 'var(--spacing-2)',
                                marginTop: 'var(--spacing-10)'
                            }}>
                                <button
                                    className="button-secondary"
                                    disabled={filters.page === 1}
                                    onClick={() => handlePageChange(filters.page - 1)}
                                    style={{ padding: '8px 16px', opacity: filters.page === 1 ? 0.5 : 1, cursor: filters.page === 1 ? 'not-allowed' : 'pointer' }}
                                >
                                    Previous
                                </button>

                                <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
                                    {[...Array(data.totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => handlePageChange(i + 1)}
                                            style={{
                                                padding: '8px 12px',
                                                borderRadius: 'var(--radius-md)',
                                                border: 'none',
                                                backgroundColor: filters.page === i + 1 ? 'var(--color-primary)' : 'var(--color-bg-base)',
                                                color: filters.page === i + 1 ? '#ffffff' : 'var(--color-text)',
                                                cursor: 'pointer',
                                                boxShadow: filters.page === i + 1 ? 'inset 4px 4px 8px rgba(0,0,0,0.2)' : '4px 4px 8px rgba(0,0,0,0.1), -4px -4px 8px rgba(255,255,255,0.8)',
                                                fontWeight: filters.page === i + 1 ? 'bold' : 'normal'
                                            }}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    className="button-secondary"
                                    disabled={filters.page === data.totalPages}
                                    onClick={() => handlePageChange(filters.page + 1)}
                                    style={{ padding: '8px 16px', opacity: filters.page === data.totalPages ? 0.5 : 1, cursor: filters.page === data.totalPages ? 'not-allowed' : 'pointer' }}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Sidebar (Filters on the Right) */}
            <div style={{ width: '320px', flexShrink: 0 }}>
                <FilterSidebar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onReset={handleReset}
                />
            </div>

        </div>
    );
};

export default Products;
