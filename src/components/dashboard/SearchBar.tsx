'use client'

import { useState } from 'react'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setSearching(true)
    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })

      const result = await response.json()
      console.log('Search results:', result)
      // TODO: Mostrar resultados en un modal o página
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setSearching(false)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="= Buscar con IA... (ej: 'analiza la eficiencia del último mes')"
        className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-sm text-gray-700 placeholder-gray-400"
      />
      <button
        type="submit"
        disabled={searching || !query.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50"
      >
        {searching ? '...' : 'Buscar'}
      </button>
    </form>
  )
}
