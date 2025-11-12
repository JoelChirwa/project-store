import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        const data = await res.json();
        if (mounted) setProduct(data.data || null);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load product');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <div className="p-6">Loading product…</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!product) return <div className="p-6">Product not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <button onClick={() => navigate(-1)} className="mb-4 text-sm text-blue-600 underline">Back</button>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full product-image">
              <img src={product.image} alt={product.name} className="object-cover w-full h-96 rounded" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>
              <div className="text-xl font-bold mb-4">${parseFloat(product.price).toFixed(2)}</div>
              {product.description && <p className="text-gray-700 mb-4">{product.description}</p>}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    navigate('/coming-soon', { state: { productName: product.name, productId: id } })
                  }}
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                >
                  Add to cart
                </button>
                <button onClick={() => navigate(`/products/${id}/edit`)} className="px-4 py-2 rounded border">Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

