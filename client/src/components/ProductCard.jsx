import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product = {}, onEdit, onDelete }) {
	const { _id, name, price, image, description } = product;

	const formattedPrice = (() => {
		const p = parseFloat(price);
		return Number.isFinite(p) ? `$${p.toFixed(2)}` : '';
	})();

	return (
				<article className="product-card bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
					<div className="product-image">
						<Link to={_id ? `/products/${_id}` : '#'}>
							<img
								src={image || 'https://via.placeholder.com/400x300?text=No+Image'}
								alt={name || 'Product image'}
								className="object-cover w-full h-full"
							/>
						</Link>
					</div>

				<div className="p-4 flex-1 flex flex-col">
							<h3 className="text-sm font-semibold text-gray-800 truncate">{name || 'Untitled product'}</h3>
							{description ? (
								<p className="mt-1 text-xs text-gray-600 line-clamp-2">{description}</p>
							) : null}

					<div className="mt-4 flex items-center justify-between">
					<div className="text-lg font-bold text-gray-900">{formattedPrice}</div>

						<div className="flex items-center gap-2">
										<button
											onClick={() => onEdit && onEdit(product)}
											className="inline-flex items-center gap-2 rounded-md border px-3 py-1 text-gray-700 hover:bg-gray-50"
										>
								Edit
							</button>

							<button
								onClick={() => onDelete && onDelete(product)}
								className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-700"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			</article>
	);
}

