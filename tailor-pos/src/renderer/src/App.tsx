import React, { useState } from 'react'

const INITIAL_STATE = {
  customerName: '',
  phoneNumber: '',
  lambayi: '',
  tira: '',
  astain: '',
  astainType: 'Fit',
  colar: '',
  colarType: 'English Small',
  width: '',
  widthType: 'Daman Gol',
  chati: '',
  shalwar: '',
  painsa: '',
  frontPocket: '',
  sidePocket: '',
  patti: '',
  remarks: ''
}

function App(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new')
  const [formData, setFormData] = useState(INITIAL_STATE)
  const [currentOrderData, setCurrentOrderData] = useState<any>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleReviewOrder = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmModal(true)
  }

  const handleConfirmAndPrint = async () => {
    try {
      // @ts-ignore (exposed via preload)
      const result = await window.api.saveOrder(formData)

      if (result.success) {
        setShowConfirmModal(false)
        setCurrentOrderData({ ...formData, orderId: `#TK-${Date.now().toString().slice(-6)}`, date: new Date().toLocaleString() })
        
        setTimeout(() => {
          window.print()
          alert('Measurement Saved & Receipt Printed!')
          setFormData(INITIAL_STATE)
          setCurrentOrderData(null)
        }, 100)
      } else {
        alert('Error saving to database: ' + result.error)
      }
    } catch (error) {
      console.error('IPC Error:', error)
      alert('Failed to communicate with backend.')
    }
  }

  return (
    <>
      {/* Renderer View */}
      <div className="no-print-area min-h-screen bg-slate-50 p-6 font-sans text-slate-900">
        <div className="mx-auto max-w-5xl">
          {/* Navigation Tabs */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
              <button
                onClick={() => setActiveTab('new')}
                className={`rounded-lg px-6 py-2 text-sm font-semibold transition-all ${
                  activeTab === 'new'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                New Order
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`rounded-lg px-6 py-2 text-sm font-semibold transition-all ${
                  activeTab === 'history'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                History
              </button>
            </div>
          </div>

          {activeTab === 'new' ? (
            <>
              {/* Header */}
              <header className="mb-8 flex items-center justify-between border-b border-slate-200 pb-6">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-800">Tailor POS</h1>
                  <p className="text-slate-500">New Measurement Entry - Shalwar Kameez</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-400">Order ID: #TK-{Date.now().toString().slice(-6)}</p>
                  <p className="text-sm font-medium text-slate-400">{new Date().toLocaleDateString()}</p>
                </div>
              </header>

              <form onSubmit={handleReviewOrder} className="space-y-8">
                {/* Customer Section */}
                <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                  <h2 className="mb-6 text-lg font-semibold text-slate-800">Customer Information</h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Customer Name</label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="e.g. 0300-1234567"
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        required
                      />
                    </div>
                  </div>
                </section>

                {/* Measurements Section */}
                <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                  <h2 className="mb-6 text-lg font-semibold text-slate-800">Measurements (Inches)</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Lambayi */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Lambayi (Length)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="lambayi"
                        value={formData.lambayi}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>

                    {/* Tira */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Tira (Shoulder)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="tira"
                        value={formData.tira}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>

                    {/* Astain */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Astain (Sleeves)</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="0.1"
                          name="astain"
                          value={formData.astain}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        />
                        <select
                          name="astainType"
                          value={formData.astainType}
                          onChange={handleChange}
                          className="rounded-lg border border-slate-300 bg-slate-50 px-2 text-sm outline-none transition focus:border-indigo-500"
                        >
                          <option>Fit</option>
                          <option>Loose</option>
                        </select>
                      </div>
                    </div>

                    {/* Colar */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Colar (Collar)</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="0.1"
                          name="colar"
                          value={formData.colar}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        />
                        <select
                          name="colarType"
                          value={formData.colarType}
                          onChange={handleChange}
                          className="rounded-lg border border-slate-300 bg-slate-50 px-2 text-sm outline-none transition focus:border-indigo-500"
                        >
                          <option>English Small</option>
                          <option>Ban</option>
                          <option>Sherwani</option>
                        </select>
                      </div>
                    </div>

                    {/* Width */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Width</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="0.1"
                          name="width"
                          value={formData.width}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        />
                        <select
                          name="widthType"
                          value={formData.widthType}
                          onChange={handleChange}
                          className="rounded-lg border border-slate-300 bg-slate-50 px-2 text-sm outline-none transition focus:border-indigo-500"
                        >
                          <option>Daman Gol</option>
                          <option>Chauras</option>
                        </select>
                      </div>
                    </div>

                    {/* Chati */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Chati (Chest)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="chati"
                        value={formData.chati}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>

                    {/* Shalwar */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Shalwar</label>
                      <input
                        type="number"
                        step="0.1"
                        name="shalwar"
                        value={formData.shalwar}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>

                    {/* Painsa */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Painsa</label>
                      <input
                        type="number"
                        step="0.1"
                        name="painsa"
                        value={formData.painsa}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>

                    {/* Patti */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Patti</label>
                      <input
                        type="text"
                        name="patti"
                        value={formData.patti}
                        onChange={handleChange}
                        placeholder="e.g. 1.25"
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>

                    {/* Front Pocket */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Front Pocket</label>
                      <input
                        type="text"
                        name="frontPocket"
                        value={formData.frontPocket}
                        onChange={handleChange}
                        placeholder="Square / Round"
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>

                    {/* Side Pocket */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Side Pocket (Qty)</label>
                      <input
                        type="number"
                        name="sidePocket"
                        value={formData.sidePocket}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>
                  </div>
                </section>

                {/* Remarks Section */}
                <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                  <h2 className="mb-6 text-lg font-semibold text-slate-800">Other Remarks</h2>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Add any specific requirements or notes here..."
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  ></textarea>
                </section>

                {/* Action Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 sm:w-auto"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                    Review Order
                  </button>
                </div>
              </form>
            </>
          ) : (
            <HistoryView />
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="no-print-area fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-indigo-600 p-6 text-white text-center">
              <h3 className="text-2xl font-bold">Review Measurements</h3>
              <p className="opacity-90">Please confirm all details before saving</p>
            </div>
            
            <div className="p-8">
              {/* Customer Info Summary */}
              <div className="mb-8 flex justify-between border-b border-slate-100 pb-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Customer</p>
                  <p className="text-xl font-bold text-slate-800">{formData.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Contact</p>
                  <p className="text-xl font-bold text-slate-800">{formData.phoneNumber}</p>
                </div>
              </div>

              {/* Measurements Grid Summary */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-3">
                {[
                  { label: 'Length', value: formData.lambayi },
                  { label: 'Shoulder', value: formData.tira },
                  { label: 'Sleeves', value: `${formData.astain}" (${formData.astainType})` },
                  { label: 'Collar', value: `${formData.colar}" (${formData.colarType})` },
                  { label: 'Width', value: `${formData.width}" (${formData.widthType})` },
                  { label: 'Chest', value: formData.chati },
                  { label: 'Shalwar', value: formData.shalwar },
                  { label: 'Painsa', value: formData.painsa },
                  { label: 'Patti', value: formData.patti },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-50 rounded-xl p-3 ring-1 ring-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">{item.label}</p>
                    <p className="text-sm font-bold text-slate-700">{item.value || '-'}</p>
                  </div>
                ))}
              </div>

              {formData.remarks && (
                <div className="mt-6 rounded-xl bg-amber-50 p-4 ring-1 ring-amber-100">
                  <p className="text-[10px] uppercase font-bold text-amber-600 mb-1">Special Remarks</p>
                  <p className="text-sm text-amber-900">{formData.remarks}</p>
                </div>
              )}

              {/* Modal Actions */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 rounded-xl bg-slate-100 py-4 font-bold text-slate-600 transition hover:bg-slate-200"
                >
                  Go Back & Edit
                </button>
                <button
                  onClick={handleConfirmAndPrint}
                  className="flex-1 rounded-xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 active:scale-[0.98]"
                >
                  Confirm & Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Area */}
      {currentOrderData && (
        <div className="print-area">
          <Receipt data={currentOrderData} />
        </div>
      )}
    </>
  )
}

function HistoryView(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState('')
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [orderToDelete, setOrderToDelete] = useState<number | null>(null)

  const handleSearch = async () => {
    setLoading(true)
    try {
      // @ts-ignore
      const result = await window.api.searchOrders(searchTerm)
      if (result.success) {
        setOrders(result.data)
      } else {
        alert('Search failed: ' + result.error)
      }
    } catch (error) {
      console.error(error)
      alert('Failed to search orders.')
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = async () => {
    if (orderToDelete === null) return
    try {
      // @ts-ignore
      const result = await window.api.deleteOrder(orderToDelete)
      if (result.success) {
        setOrders(orders.filter((o) => o.id !== orderToDelete))
      } else {
        alert('Delete failed: ' + result.error)
      }
    } catch (error) {
      console.error(error)
      alert('Failed to delete order.')
    } finally {
      setOrderToDelete(null)
    }
  }

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    setOrderToDelete(id)
  }

  // Real-time search with debounce
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch()
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Order History</h1>
          <p className="text-slate-500">Search and view past measurements</p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="flex gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search by name or phone number..."
          className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <button
          onClick={handleSearch}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white transition-all hover:bg-indigo-700"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Results Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Phone</th>
                <th className="px-6 py-4 font-semibold text-center">Measurements</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-slate-600">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{order.customerName}</td>
                    <td className="px-6 py-4 text-slate-600">{order.phoneNumber}</td>
                    <td className="px-6 py-4">
                      <div className="grid grid-cols-4 gap-2 text-[10px] text-slate-500">
                        <span>L: {order.lambayi}"</span>
                        <span>T: {order.tira}"</span>
                        <span>A: {order.astain}"</span>
                        <span>C: {order.colar}"</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={(e) => handleDeleteClick(e, order.id)}
                        className="rounded bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-indigo-600 p-6 text-white text-center relative">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 p-2 text-white/80 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-2xl font-bold">Order Details</h3>
              <p className="opacity-90">{new Date(selectedOrder.date).toLocaleString()}</p>
            </div>
            
            <div className="p-8">
              {/* Customer Info Summary */}
              <div className="mb-8 flex justify-between border-b border-slate-100 pb-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Customer</p>
                  <p className="text-xl font-bold text-slate-800">{selectedOrder.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Contact</p>
                  <p className="text-xl font-bold text-slate-800">{selectedOrder.phoneNumber}</p>
                </div>
              </div>

              {/* Measurements Grid Summary */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-3">
                {[
                  { label: 'Length', value: selectedOrder.lambayi },
                  { label: 'Shoulder', value: selectedOrder.tira },
                  { label: 'Sleeves', value: `${selectedOrder.astain}" (${selectedOrder.astainType})` },
                  { label: 'Collar', value: `${selectedOrder.colar}" (${selectedOrder.colarType})` },
                  { label: 'Width', value: `${selectedOrder.width}" (${selectedOrder.widthType})` },
                  { label: 'Chest', value: selectedOrder.chati },
                  { label: 'Shalwar', value: selectedOrder.shalwar },
                  { label: 'Painsa', value: selectedOrder.painsa },
                  { label: 'Patti', value: selectedOrder.patti },
                  { label: 'Front Pocket', value: selectedOrder.frontPocket },
                  { label: 'Side Pocket', value: selectedOrder.sidePocket },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-50 rounded-xl p-3 ring-1 ring-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">{item.label}</p>
                    <p className="text-sm font-bold text-slate-700">{item.value || '-'}</p>
                  </div>
                ))}
              </div>

              {selectedOrder.remarks && (
                <div className="mt-6 rounded-xl bg-amber-50 p-4 ring-1 ring-amber-100">
                  <p className="text-[10px] uppercase font-bold text-amber-600 mb-1">Special Remarks</p>
                  <p className="text-sm text-amber-900">{selectedOrder.remarks}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {orderToDelete !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="bg-red-500 p-6 text-white text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-bold">Confirm Deletion</h3>
            </div>
            <div className="p-6 text-center">
              <p className="text-slate-600 mb-8">Are you sure you want to permanently delete this order? This action cannot be undone.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setOrderToDelete(null)}
                  className="flex-1 rounded-xl bg-slate-100 py-3 font-bold text-slate-600 transition hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 rounded-xl bg-red-500 py-3 font-bold text-white shadow-lg shadow-red-100 transition hover:bg-red-600 active:scale-[0.98]"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


function Receipt({ data }: { data: any }): React.JSX.Element {
  return (
    <div className="space-y-4 text-sm leading-tight">
      <div className="text-center border-b border-black pb-4 mb-4">
        <h1 className="text-xl font-bold uppercase">Global Tailors</h1>
        <p className="text-xs">Excellence in Custom Stitching</p>
        <p className="text-xs font-mono">Reg#: PK-55290-2024</p>
      </div>

      <div className="grid grid-cols-2 gap-y-1 font-mono text-xs">
        <span className="font-bold">Customer:</span> <span>{data.customerName}</span>
        <span className="font-bold">Phone:</span> <span>{data.phoneNumber}</span>
        <span className="font-bold">Date:</span> <span>{data.date}</span>
        <span className="font-bold">Order ID:</span> <span>{data.orderId}</span>
      </div>

      <div className="border-y border-black py-2 my-2">
        <h2 className="text-center font-bold uppercase mb-2">Measurements</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-xs">
          <span>Length (L):</span> <span className="text-right">{data.lambayi}"</span>
          <span>Shoulder (T):</span> <span className="text-right">{data.tira}"</span>
          <span>Sleeves (A):</span> <span className="text-right">{data.astain}" ({data.astainType})</span>
          <span>Collar (C):</span> <span className="text-right">{data.colar}" ({data.colarType})</span>
          <span>Width (W):</span> <span className="text-right">{data.width}" ({data.widthType})</span>
          <span>Chest:</span> <span className="text-right">{data.chati}"</span>
          <span>Shalwar:</span> <span className="text-right">{data.shalwar}"</span>
          <span>Painsa:</span> <span className="text-right">{data.painsa}"</span>
          <span>Patti:</span> <span className="text-right">{data.patti}</span>
          <span>Front Pocket:</span> <span className="text-right">{data.frontPocket}</span>
          <span>Side Pocket:</span> <span className="text-right">{data.sidePocket}</span>
        </div>
      </div>

      {data.remarks && (
        <div className="text-xs italic border-b border-black pb-2">
          <span className="font-bold">Notes:</span> {data.remarks}
        </div>
      )}

      <div className="text-center pt-4">
        <p className="text-[10px] uppercase font-bold">Thank you for your business!</p>
        <p className="text-[8px]">Software by Tailor POS</p>
      </div>
    </div>
  )
}

export default App


