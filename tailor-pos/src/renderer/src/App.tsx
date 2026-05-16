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
  const [formData, setFormData] = useState(INITIAL_STATE)
  const [currentOrderData, setCurrentOrderData] = useState<any>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // @ts-ignore (exposed via preload)
      const result = await window.api.saveOrder(formData)

      if (result.success) {
        // Set data for receipt and trigger print
        setCurrentOrderData({ ...formData, orderId: `#TK-${Date.now().toString().slice(-6)}`, date: new Date().toLocaleString() })
        
        // Short delay to allow React to render the Receipt component before printing
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
          {/* Header */}
          <header className="mb-8 flex items-center justify-between border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-800">Tailor POS</h1>
              <p className="text-slate-500">New Measurement Entry - Shalwar Kameez</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-slate-400">Order ID: #TK-2024-001</p>
              <p className="text-sm font-medium text-slate-400">{new Date().toLocaleDateString()}</p>
            </div>
          </header>

          <form onSubmit={handleSave} className="space-y-8">
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
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Save & Print Receipt
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Print Area */}
      {currentOrderData && (
        <div className="print-area">
          <Receipt data={currentOrderData} />
        </div>
      )}
    </>
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


