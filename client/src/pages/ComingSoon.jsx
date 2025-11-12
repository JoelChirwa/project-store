import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function ComingSoon() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const productName = state?.productName || ''
  const productId = state?.productId || null

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-gray-50 to-white px-4">
      <div className="max-w-4xl w-full p-8 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          This feature is coming soon. We're working on it — check back shortly
        </h1>
      </div>
    </div>
  )
}
