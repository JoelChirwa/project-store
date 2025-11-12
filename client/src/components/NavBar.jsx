import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();

  return (
	<header className="bg-white shadow-sm sticky top-0 z-50">
	  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div className="flex h-16 items-center justify-between">
		  <div className="flex items-center">
			<Link to="/" className="flex items-center gap-2">
			  <div className="h-8 w-8 bg-blue-600 text-white rounded flex items-center justify-center font-bold">P</div>
			  <span className="font-semibold text-lg text-gray-800">ProductsStore</span>
			</Link>
		  </div>

		  <div className="flex items-center gap-3">
			<button
			  onClick={() => navigate('/create')}
			  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
			>
			  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
				<path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
			  </svg>
			  Create
			</button>
		  </div>
		</div>
	  </div>
	</header>
  );
}

