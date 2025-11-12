import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center">
        <p className="text-sm text-gray-600">© {new Date().getFullYear()} Products Store — Built with ❤️ By Joel Chirwa.</p>
      </div>
    </footer>
  )
}
