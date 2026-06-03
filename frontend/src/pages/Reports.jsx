import { useEffect, useState } from 'react'
import api from '../api/axios'

function Reports() {
  const [reports, setReports] = useState([])
  const [results, setResults] = useState([])
  const [form, setForm] = useState({
    type: 'appointments',
    from_date: '',
    to_date: '',
  })
  const [message, setMessage] = useState('')

  const fetchReports = async () => {
    const res = await api.get('/reports')
    setReports(res.data)
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleGenerate = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      const res = await api.post('/reports/generate', form)

      setResults(res.data.results || [])
      setMessage('Report generated successfully.')
      fetchReports()
   } catch (err) {
  console.log('Report error full:', err)
  console.log('Report error data:', err.response?.data)
  alert(JSON.stringify(err.response?.data, null, 2))
  setMessage('Report could not be generated.')
}
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report?')) return

    await api.delete(`/reports/${id}`)
    fetchReports()
  }

  const exportReport = (type, format) => {
  window.open(
    `http://127.0.0.1:8000/api/exports/${type}?format=${format}`,
    '_blank'
  )
}

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">
          Dynamic Reports
        </h1>

        <p className="text-gray-600 mt-2">
          Generate reports based on type and date range.
        </p>
      </div>

      {message && (
        <div className="bg-blue-50 border text-blue-800 p-4 rounded-xl">
          {message}
        </div>
      )}

      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-blue-900 mb-5">
          Generate New Report
        </h2>

        <form onSubmit={handleGenerate} className="grid md:grid-cols-4 gap-4">
          <select
            className="border p-3 rounded-lg"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="appointments">Appointments</option>
            <option value="patients">Patients</option>
            <option value="doctors">Doctors</option>
          </select>

          <input
            type="date"
            className="border p-3 rounded-lg"
            value={form.from_date}
            onChange={(e) => setForm({ ...form, from_date: e.target.value })}
          />

          <input
            type="date"
            className="border p-3 rounded-lg"
            value={form.to_date}
            onChange={(e) => setForm({ ...form, to_date: e.target.value })}
          />

          <button className="bg-blue-900 text-white px-6 py-3 rounded-lg">
            Generate
          </button>
        </form>
      </div>

      {results.length > 0 && (
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-blue-900 mb-5">
            Generated Results
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  {Object.keys(results[0]).map((key) => (
                    <th key={key} className="p-3 text-left border">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {results.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="p-3 border">
                        {typeof value === 'object' && value !== null
                          ? JSON.stringify(value)
                          : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-3 mt-4">
  <button
    onClick={() => exportReport(form.type, 'csv')}
    className="bg-green-700 text-white px-4 py-2 rounded-lg"
  >
    Export CSV
  </button>

  <button
    onClick={() => exportReport(form.type, 'json')}
    className="bg-blue-700 text-white px-4 py-2 rounded-lg"
  >
    Export JSON
  </button>

  <button
    onClick={() => exportReport(form.type, 'xlsx')}
    className="bg-purple-700 text-white px-4 py-2 rounded-lg"
  >
    Export Excel
  </button>
</div>
          </div>
        </div>
      )}

      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-blue-900 mb-5">
          Saved Reports
        </h2>

        {reports.length === 0 ? (
          <p className="text-gray-500">
            No reports generated yet.
          </p>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="border rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-blue-900">
                    {report.title}
                  </h3>

                  <p className="text-sm text-gray-600">
                    Type: {report.type}
                  </p>

                  <p className="text-sm text-gray-600">
                    From: {report.from_date || 'N/A'} | To:{' '}
                    {report.to_date || 'N/A'}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(report.id)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports