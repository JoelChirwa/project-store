import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:5000/api/products');
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();
        if (mounted) setProducts(data.data || []);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  function handleAddToCart(product) {
    // Placeholder — integrate with store or API as needed
    console.log('Add to cart', product);
    alert(`${product.name || 'Product'} added to cart (demo)`);
  }

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleEdit(product) {
    if (!product || !product._id) return;
    navigate(`/products/${product._id}/edit`);
  }

  // deletion via in-app confirmation modal + toast
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmProduct, setConfirmProduct] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });

  function openConfirm(product) {
    setConfirmProduct(product);
    setConfirmOpen(true);
  }

  function closeConfirm() {
    setConfirmOpen(false);
    setConfirmProduct(null);
  }

  async function confirmDelete() {
    const product = confirmProduct;
    if (!product || !product._id) return;
    closeConfirm();

    try {
      const res = await fetch(`http://localhost:5000/api/products/${product._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Status ${res.status}`);
      // remove from list
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== (product._id || product.id)));
      // show toast
      setToast({ visible: true, message: `Product "${product.name}" deleted successfully.` });
      setTimeout(() => setToast({ visible: false, message: '' }), 3500);
    } catch (err) {
      setToast({ visible: true, message: 'Failed to delete: ' + (err.message || err) });
      setTimeout(() => setToast({ visible: false, message: '' }), 3500);
    }
  }

  // --- Pagination helpers ---
  const PAGE_SIZE = 8;

  function getPaginatedProducts(list, searchParams) {
    const raw = parseInt(searchParams.get('page') || '1', 8) || 1;
    const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    const page = Math.min(Math.max(raw, 1), totalPages);
    const start = (page - 1) * PAGE_SIZE;
    return list.slice(start, start + PAGE_SIZE);
  }

  function PaginationControls({ products, searchParams, setSearchParams }) {
    const raw = parseInt(searchParams.get('page') || '1', 8) || 1;
    const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
    const page = Math.min(Math.max(raw, 1), totalPages);

    function goTo(p) {
      const q = p <= 1 ? { page: '1' } : { page: String(p) };
      setSearchParams(q);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mb-4">
        <div>
          <button
            onClick={() => goTo(page - 1)}
            disabled={page <= 1}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${page <= 1 ? 'opacity-50 cursor-not-allowed' : 'bg-white hover:bg-gray-100'}`}>
            &larr; Previous
          </button>
        </div>

        <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>

        <div>
          <button
            onClick={() => goTo(page + 1)}
            disabled={page >= totalPages}
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${page >= totalPages ? 'opacity-50 cursor-not-allowed' : 'bg-white hover:bg-gray-100'}`}>
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
  <h1 className="text-2xl text-center font-semibold text-gray-900 mb-6">Available Products</h1>

        {loading ? (
          <div className="text-center text-gray-600">Loading products…</div>
        ) : error ? (
          <div className="text-center text-red-600">Error: {error}</div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <p className="text-center text-sm text-gray-600 mb-2">
              There are no products yet.{' '}
              <button
                onClick={() => navigate('/create')}
                className="inline-block text-blue-600 underline ml-1"
              >
                Create a product
              </button>
            </p>
          </div>
        ) : (
            <div className="flex justify-center">
              <div className="w-full max-w-6xl bg-white rounded-lg p-6 shadow-sm">

                {/* Pagination controls (top) */}
                <PaginationControls
                  products={products}
                  searchParams={searchParams}
                  setSearchParams={setSearchParams}
                />

                <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {getPaginatedProducts(products, searchParams).map((p) => (
              <ProductCard
                key={p._id || p.id}
                product={p}
                  onEdit={handleEdit}
                  onDelete={openConfirm}
              />
            ))}
          </div>

                {/* Pagination controls (bottom) */}
                <div className="mt-6">
                  <PaginationControls
                    products={products}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                  />
                </div>
              </div>
            </div>
        )}
      </main>

      {/* Confirmation modal */}
      {confirmOpen && (
        <div className="modal-backdrop fixed inset-0 z-40 flex items-center justify-center">
          <div className="modal bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900">Confirm deletion</h3>
            <p className="mt-2 text-sm text-gray-600">Are you sure you want to delete <strong>{confirmProduct?.name}</strong>?</p>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={closeConfirm} className="px-3 py-1 rounded-md border">Cancel</button>
              <button onClick={confirmDelete} className="px-3 py-1 rounded-md bg-red-600 text-white">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.visible && (
        <div className="toast fixed right-4 bottom-4 z-50 bg-gray-900 text-white px-4 py-2 rounded shadow">
          {toast.message}
        </div>
      )}
    </div>
  );
}
