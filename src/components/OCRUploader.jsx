import React, { useRef, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function OCRUploader({ onAddItem }) {
  const fileInput = useRef(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file) => {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('file', file)
      const resp = await fetch(`${API_BASE}/api/extract-tag`, {
        method: 'POST',
        body: form,
      })
      if (!resp.ok) throw new Error(await resp.text())
      const data = await resp.json()
      const item = {
        name: data.name || 'Item',
        mrp: data.mrp || null,
        sell_price: data.sell_price || (data.mrp ?? 0),
        qty: 1,
      }
      onAddItem(item)
    } catch (e) {
      setError('Failed to read image. Try a clearer photo.')
    } finally {
      setLoading(false)
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
      <div className="flex flex-col items-center gap-3">
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="block w-full text-sm text-blue-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
        />
        {loading && <p className="text-blue-300 text-sm">Reading tag…</p>}
        {error && <p className="text-red-300 text-sm">{error}</p>}
      </div>
    </div>
  )
}
