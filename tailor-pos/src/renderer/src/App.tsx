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
  const [showPrintPreview, setShowPrintPreview] = useState(false)

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') {
      return saved
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

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
      let result
      // @ts-ignore
      if ((formData as any).id) {
        // @ts-ignore
        result = await window.api.updateOrder(formData)
      } else {
        // @ts-ignore
        result = await window.api.saveOrder(formData)
      }

      if (result.success) {
        setShowConfirmModal(false)
        const generatedOrderId = (formData as any).orderId || `#TK-${Date.now().toString().slice(-6)}`
        const generatedDate = (formData as any).date || new Date().toLocaleString()
        
        setCurrentOrderData({ 
          ...formData, 
          orderId: generatedOrderId, 
          date: generatedDate 
        })
        setShowPrintPreview(true)
      } else {
        alert('Error saving to database: ' + result.error)
      }
    } catch (error) {
      console.error('IPC Error:', error)
      alert('Failed to communicate with backend.')
    }
  }

  const handleBackup = async () => {
    try {
      // @ts-ignore
      const result = await window.api.exportBackup()
      if (result.success) {
        alert('Database backup saved successfully!')
      } else if (result.error && result.error !== 'Canceled by user') {
        alert('Failed to save backup: ' + result.error)
      }
    } catch (error: any) {
      console.error(error)
      alert('Failed to initiate database backup: ' + error.message)
    }
  }

  return (
    <>
      {/* Renderer View */}
      <div className="no-print-area min-h-screen bg-slate-50 dark:bg-slate-950 p-6 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <div className="mx-auto max-w-5xl">
          {/* Navigation Tabs */}
          <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="hidden sm:block sm:w-1/3"></div> {/* Spacer for desk layout symmetry */}
            
            <div className="inline-flex rounded-xl bg-white dark:bg-slate-900 p-1 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
              <button
                onClick={() => setActiveTab('new')}
                className={`rounded-lg px-6 py-2 text-sm font-semibold transition-all ${
                  activeTab === 'new'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                New Order
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`rounded-lg px-6 py-2 text-sm font-semibold transition-all ${
                  activeTab === 'history'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                History
              </button>
            </div>

            <div className="w-full sm:w-1/3 flex justify-center sm:justify-end gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-slate-600 dark:text-slate-300 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white flex items-center justify-center cursor-pointer active:scale-95 duration-100"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                onClick={handleBackup}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white flex items-center gap-1.5 cursor-pointer active:scale-95 duration-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Backup Database
              </button>
            </div>
          </div>

          {activeTab === 'new' ? (
            <>
              {/* Header */}
              <header className="mb-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Tailor POS</h1>
                  <p className="text-slate-500 dark:text-slate-400">{(formData as any).id ? 'Edit Measurement Entry' : 'New Measurement Entry'} - Shalwar Kameez</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-400 dark:text-slate-500">Order ID: #TK-{Date.now().toString().slice(-6)}</p>
                  <p className="text-sm font-medium text-slate-400 dark:text-slate-500">{new Date().toLocaleDateString()}</p>
                </div>
              </header>

              <form onSubmit={handleReviewOrder} className="space-y-8">
                {/* Customer Section */}
                <section className="rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
                  <h2 className="mb-6 text-lg font-semibold text-slate-800 dark:text-slate-100">Customer Information</h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Customer Name</label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="e.g. 0300-1234567"
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
                        required
                      />
                    </div>
                  </div>
                </section>

                {/* Measurements Section */}
                <section className="rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
                  <h2 className="mb-6 text-lg font-semibold text-slate-800 dark:text-slate-100">Measurements (Inches)</h2>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Lambayi */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Lambayi (Length)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="lambayi"
                        value={formData.lambayi}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
                      />
                    </div>

                    {/* Tira */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tira (Shoulder)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="tira"
                        value={formData.tira}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
                      />
                    </div>

                    {/* Astain */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Astain (Sleeves)</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="0.1"
                          name="astain"
                          value={formData.astain}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
                        />
                        <select
                          name="astainType"
                          value={formData.astainType}
                          onChange={handleChange}
                          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500"
                        >
                          <option>Fit</option>
                          <option>Loose</option>
                        </select>
                      </div>
                    </div>

                    {/* Colar */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Colar (Collar)</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="0.1"
                          name="colar"
                          value={formData.colar}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
                        />
                        <select
                          name="colarType"
                          value={formData.colarType}
                          onChange={handleChange}
                          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500"
                        >
                          <option>English Small</option>
                          <option>Ban</option>
                          <option>Sherwani</option>
                        </select>
                      </div>
                    </div>

                    {/* Width */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Width</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="0.1"
                          name="width"
                          value={formData.width}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
                        />
                        <select
                          name="widthType"
                          value={formData.widthType}
                          onChange={handleChange}
                          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500"
                        >
                          <option>Daman Gol</option>
                          <option>Chauras</option>
                        </select>
                      </div>
                    </div>

                    {/* Chati */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Chati (Chest)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="chati"
                        value={formData.chati}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
                      />
                    </div>

                    {/* Shalwar */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Shalwar</label>
                      <input
                        type="number"
                        step="0.1"
                        name="shalwar"
                        value={formData.shalwar}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
                      />
                    </div>

                    {/* Painsa */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Painsa</label>
                      <input
                        type="number"
                        step="0.1"
                        name="painsa"
                        value={formData.painsa}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
                      />
                    </div>

                    {/* Patti */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Patti</label>
                      <input
                        type="text"
                        name="patti"
                        value={formData.patti}
                        onChange={handleChange}
                        placeholder="e.g. 1.25"
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
                      />
                    </div>

                    {/* Front Pocket */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Front Pocket</label>
                      <input
                        type="text"
                        name="frontPocket"
                        value={formData.frontPocket}
                        onChange={handleChange}
                        placeholder="Square / Round"
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
                      />
                    </div>

                    {/* Side Pocket */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Side Pocket (Qty)</label>
                      <input
                        type="number"
                        name="sidePocket"
                        value={formData.sidePocket}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
                      />
                    </div>
                  </div>
                </section>

                {/* Remarks Section */}
                <section className="rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
                  <h2 className="mb-6 text-lg font-semibold text-slate-800 dark:text-slate-100">Other Remarks</h2>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Add any specific requirements or notes here..."
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
                  ></textarea>
                </section>

                {/* Action Button */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:bg-indigo-700 hover:shadow-indigo-300 dark:hover:shadow-none focus:outline-none focus:ring-4 focus:ring-indigo-500/50 sm:w-auto"
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
            <HistoryView onEditOrder={(order) => { setFormData(order); setActiveTab('new') }} />
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="no-print-area fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-2xl animate-in fade-in zoom-in duration-200 ring-1 ring-black/5 dark:ring-slate-800">
            <div className="bg-indigo-600 p-6 text-white text-center">
              <h3 className="text-2xl font-bold">Review Measurements</h3>
              <p className="opacity-90">Please confirm all details before saving</p>
            </div>
            
            <div className="p-8">
              {/* Customer Info Summary */}
              <div className="mb-8 flex justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1">Customer</p>
                  <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{formData.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1">Contact</p>
                  <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{formData.phoneNumber}</p>
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
                  <div key={item.label} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 ring-1 ring-slate-100 dark:ring-slate-800">
                    <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-0.5">{item.label}</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.value || '-'}</p>
                  </div>
                ))}
              </div>

              {formData.remarks && (
                <div className="mt-6 rounded-xl bg-amber-50 dark:bg-amber-950/20 p-4 ring-1 ring-amber-100 dark:ring-amber-900/30">
                  <p className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 mb-1">Special Remarks</p>
                  <p className="text-sm text-amber-900 dark:text-amber-200">{formData.remarks}</p>
                </div>
              )}

              {/* Modal Actions */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800 py-4 font-bold text-slate-600 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Go Back & Edit
                </button>
                <button
                  onClick={handleConfirmAndPrint}
                  className="flex-1 rounded-xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-100 dark:shadow-none transition hover:bg-indigo-700 active:scale-[0.98]"
                >
                  Confirm & Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Preview Modal */}
      {showPrintPreview && currentOrderData && (
        <div className="no-print-area fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row gap-6 max-w-4xl w-full items-center justify-center animate-in fade-in zoom-in-95 duration-200 my-8">
            
            {/* The Receipt Preview (80mm width) */}
            <div className="receipt-paper bg-white shadow-2xl rounded-sm max-h-[85vh] overflow-y-auto select-none">
              <Receipt data={currentOrderData} />
            </div>

            {/* Actions Panel */}
            <div className="flex flex-col gap-3 w-full md:w-64 bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-750 shadow-xl justify-center">
              <div className="text-center md:text-left mb-2">
                <h4 className="text-lg font-bold text-white">Receipt Preview</h4>
                <p className="text-[11px] text-slate-400 leading-normal mt-1">Exact size: 80mm wide thermal roll. Verify details before physically printing.</p>
              </div>

              <hr className="border-slate-700 my-1" />

              <button
                onClick={() => {
                  window.print()
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 px-4 font-bold text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-500 active:scale-[0.98] cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Now
              </button>

              <button
                onClick={() => {
                  setFormData(INITIAL_STATE)
                  setCurrentOrderData(null)
                  setShowPrintPreview(false)
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 px-4 font-bold text-white shadow-lg shadow-indigo-950/20 transition hover:bg-indigo-500 active:scale-[0.98] cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Done & New Order
              </button>

              <button
                onClick={() => {
                  setShowPrintPreview(false)
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-700 py-3 px-4 font-bold text-slate-300 transition hover:bg-slate-650 hover:text-white active:scale-[0.98] cursor-pointer"
              >
                Close Preview
              </button>
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

function HistoryView({ onEditOrder }: { onEditOrder: (order: any) => void }): React.JSX.Element {
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
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Order History</h1>
          <p className="text-slate-500 dark:text-slate-400">Search and view past measurements</p>
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
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900"
        />
        <button
          onClick={handleSearch}
          className="rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white transition-all hover:bg-indigo-700"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Results Table */}
      <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Phone</th>
                <th className="px-6 py-4 font-semibold text-center">Measurements</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{order.customerName}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{order.phoneNumber}</td>
                    <td className="px-6 py-4">
                      <div className="grid grid-cols-4 gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                        <span>L: {order.lambayi}"</span>
                        <span>T: {order.tira}"</span>
                        <span>A: {order.astain}"</span>
                        <span>C: {order.colar}"</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onEditOrder(order) }}
                          className="rounded bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 transition hover:bg-indigo-100 dark:hover:bg-indigo-900/60 hover:text-indigo-700 dark:hover:text-indigo-300"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={(e) => handleDeleteClick(e, order.id)}
                          className="rounded bg-red-50 dark:bg-red-950/40 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 transition hover:bg-red-100 dark:hover:bg-red-900/60 hover:text-red-700 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-2xl animate-in fade-in zoom-in duration-200 ring-1 ring-black/5 dark:ring-slate-800">
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
              <div className="mb-8 flex justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1">Customer</p>
                  <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{selectedOrder.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1">Contact</p>
                  <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{selectedOrder.phoneNumber}</p>
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
                  <div key={item.label} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 ring-1 ring-slate-100 dark:ring-slate-800">
                    <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-0.5">{item.label}</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.value || '-'}</p>
                  </div>
                ))}
              </div>

              {selectedOrder.remarks && (
                <div className="mt-6 rounded-xl bg-amber-50 dark:bg-amber-950/20 p-4 ring-1 ring-amber-100 dark:ring-amber-900/30">
                  <p className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 mb-1">Special Remarks</p>
                  <p className="text-sm text-amber-900 dark:text-amber-200">{selectedOrder.remarks}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {orderToDelete !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-2xl animate-in fade-in zoom-in duration-200 ring-1 ring-black/5 dark:ring-slate-800">
            <div className="bg-red-500 p-6 text-white text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-xl font-bold">Confirm Deletion</h3>
            </div>
            <div className="p-6 text-center">
              <p className="text-slate-600 dark:text-slate-300 mb-8">Are you sure you want to permanently delete this order? This action cannot be undone.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setOrderToDelete(null)}
                  className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800 py-3 font-bold text-slate-600 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 rounded-xl bg-red-500 py-3 font-bold text-white shadow-lg shadow-red-100 dark:shadow-none transition hover:bg-red-600 active:scale-[0.98]"
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


