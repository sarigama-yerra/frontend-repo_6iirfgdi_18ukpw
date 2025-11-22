import React from 'react'

export default function BillTable({ items, onUpdateItem, onRemove }) {
  const total = items.reduce((sum, it) => sum + (Number(it.sell_price || 0) * Number(it.qty || 1)), 0)

  const handleChange = (idx, key, val) => {
    const next = { ...items[idx], [key]: val }
    onUpdateItem(idx, next)
  }

  return (
    <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-900/60 text-blue-200">
          <tr>
            <th className="px-3 py-2">Item</th>
            <th className="px-3 py-2">MRP</th>
            <th className="px-3 py-2">Sell</th>
            <th className="px-3 py-2">Qty</th>
            <th className="px-3 py-2 text-right">Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i} className="border-t border-slate-700/50 text-blue-100">
              <td className="px-3 py-2">
                <input value={it.name || ''} onChange={e=>handleChange(i,'name', e.target.value)} className="w-full bg-transparent border border-slate-700 rounded px-2 py-1" />
              </td>
              <td className="px-3 py-2">
                <input type="number" value={it.mrp ?? ''} onChange={e=>handleChange(i,'mrp', parseFloat(e.target.value))} className="w-24 bg-transparent border border-slate-700 rounded px-2 py-1" />
              </td>
              <td className="px-3 py-2">
                <input type="number" value={it.sell_price ?? ''} onChange={e=>handleChange(i,'sell_price', parseFloat(e.target.value))} className="w-24 bg-transparent border border-slate-700 rounded px-2 py-1" />
              </td>
              <td className="px-3 py-2">
                <input type="number" min={1} value={it.qty ?? 1} onChange={e=>handleChange(i,'qty', parseInt(e.target.value||'1'))} className="w-16 bg-transparent border border-slate-700 rounded px-2 py-1" />
              </td>
              <td className="px-3 py-2 text-right">
                ₹ {(Number(it.sell_price||0) * Number(it.qty||1)).toFixed(2)}
              </td>
              <td className="px-3 py-2 text-right">
                <button onClick={()=>onRemove(i)} className="text-red-300 hover:text-red-200">Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t border-slate-700/50">
            <td colSpan={4} className="px-3 py-3 text-right text-blue-200">Total</td>
            <td className="px-3 py-3 text-right text-white font-semibold">₹ {total.toFixed(2)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
