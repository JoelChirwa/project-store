import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreatePage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const MAX_DESCRIPTION = 300;

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !price || !image.trim() || !description.trim()) {
      setError('Please fill all fields');
      return;
    }

    const parsedPrice = parseFloat(price);
    if (!Number.isFinite(parsedPrice)) {
      setError('Price must be a valid number');
      return;
    }

    setLoading(true);

    try {
  const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), price: parsedPrice, image: image.trim(), description: description.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Server responded ${res.status}`);

      setToast({ visible: true, message: `Product "${data.data.name}" created.` });
      setTimeout(() => setToast({ visible: false, message: '' }), 3000);
      // navigate back to home after short delay so user sees toast
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      setError(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="min-h-screen bg-gray-50 py-10">
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create Product</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          {error && <div className="text-red-600">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2 bg-white text-gray-900" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2 bg-white text-gray-900" placeholder="e.g. 55.22" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input value={image} onChange={(e) => setImage(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2 bg-white text-gray-900" placeholder="https://..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={MAX_DESCRIPTION}
              className="mt-1 block w-full rounded-md border px-3 py-2 bg-white text-gray-900"
            />
            <div className="mt-1 text-xs text-gray-500">{description.length}/{MAX_DESCRIPTION} characters</div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={() => navigate('/')} className="px-4 py-2 rounded-md border">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">
              {loading ? 'Creating…' : 'Create Product'}
            </button>
          </div>
        </form>
      </main>

      {toast.visible && <div className="fixed right-4 bottom-4 z-50 bg-gray-900 text-white px-4 py-2 rounded shadow">{toast.message}</div>}
    </div>
  );
}
