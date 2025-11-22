import React, { useState } from 'react'
import Header from './components/Header'
import OCRUploader from './components/OCRUploader'
import BillTable from './components/BillTable'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

function App() {
  const [items, setItems] = useState([])
  const [customer, setCustomer] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  const addItem = (item) => setItems(prev => [...prev, item])
  const updateItem = (idx, next) => setItems(prev => prev.map((it,i)=> i===idx? next : it))
  const removeItem = (idx) => setItems(prev => prev.filter((_,i)=> i!==idx))

  const saveBill = async () => {
    setSaving(true); setSaveMsg('')
    try {
      const resp = await fetch(`${API_BASE}/api/bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_name: customer || null, items })
      })
      if (!resp.ok) throw new Error(await resp.text())
      const data = await resp.json()
      setSaveMsg(`Saved bill #${data.id}`)
      setItems([])
      setCustomer('')
    } catch (e) {
      setSaveMsg('Failed to save bill')
    } finally { setSaving(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-blue-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.06),transparent_50%)]"></div>
      <div className="relative max-w-5xl mx-auto p-6">
        <Header />

        <div className="grid md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-1 space-y-4">
            <OCRUploader onAddItem={addItem} />
            <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
              <label className="block text-sm text-blue-200 mb-2">Customer</label>
              <input value={customer} onChange={e=>setCustomer(e.target.value)} placeholder="Optional"
                className="w-full bg-transparent border border-slate-700 rounded px-3 py-2" />
            </div>
            <button onClick={saveBill} disabled={saving || items.length===0}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-3 rounded-lg">
              {saving? 'Saving…' : 'Save Bill'}
            </button>
            {saveMsg && <p className="text-center text-sm text-blue-200 mt-2">{saveMsg}</p>}
          </div>

          <div className="md:col-span-2 space-y-4">
            <BillTable items={items} onUpdateItem={updateItem} onRemove={removeItem} />
            {items.length===0 && (
              <p className="text-blue-300/70 text-sm">Add items by snapping their tags. We'll try to read the name, MRP, and selling price automatically.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
