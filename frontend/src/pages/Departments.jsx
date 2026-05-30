import { useEffect, useState } from 'react'
import api from '../api/axios'

function Departments() {
  const [departments, setDepartments] = useState([])
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('az')

  const [form, setForm] = useState({
    name: '',
    description: '',
  })

  const [editingId, setEditingId] = useState(null)

  const activeRole = localStorage.getItem('activeRole')
  const isAdmin = activeRole === 'admin'

  const fetchDepartments = async () => {
    const res = await api.get('/departments')
    setDepartments(res.data)
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (editingId) {
      await api.put(`/departments/${editingId}`, form)
    } else {
      await api.post('/departments', form)
    }

    setForm({ name: '', description: '' })
    setEditingId(null)
    fetchDepartments()
  }

  const handleEdit = (department) => {
    setEditingId(department.id)
    setForm({
      name: department.name,
      description: department.description || '',
    })
  }

  const handleDelete = async (id) => {
    await api.delete(`/departments/${id}`)
    fetchDepartments()
  }

  const filteredDepartments = departments
    .filter((department) => {
      const name = department.name?.toLowerCase() || ''
      const description = department.description?.toLowerCase() || ''
      const searchText = search.toLowerCase()

      return (
        name.includes(searchText) ||
        description.includes(searchText)
      )
    })
    .sort((a, b) => {
      const nameA = a.name || ''
      const nameB = b.name || ''

      return sortOrder === 'az'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA)
    })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">Departments</h1>
        <p className="text-gray-600 mt-2">
          View and manage clinic departments.
        </p>
      </div>

      {isAdmin && (
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-5">
            {editingId ? 'Edit Department' : 'Add Department'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full border p-3 rounded-lg"
              placeholder="Department name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <textarea
              className="w-full border p-3 rounded-lg"
              placeholder="Department description"
              rows="4"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <div className="flex gap-3">
              <button className="bg-blue-900 text-white px-6 py-3 rounded-lg">
                {editingId ? 'Update Department' : 'Save Department'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null)
                    setForm({ name: '', description: '' })
                  }}
                  className="border px-6 py-3 rounded-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">
          Search & Filter Departments
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="border p-3 rounded-lg"
            placeholder="Search department name or description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border p-3 rounded-lg"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
          </select>
        </div>

        <p className="text-sm text-gray-500 mt-3">
          Showing {filteredDepartments.length} of {departments.length} departments
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredDepartments.length === 0 ? (
          <div className="bg-white border rounded-2xl p-6 text-gray-500">
            No departments found.
          </div>
        ) : (
          filteredDepartments.map((department) => (
            <div key={department.id} className="bg-white border rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-blue-900">
                {department.name}
              </h3>

              <p className="text-gray-600 mt-3">
                {department.description || 'No description available.'}
              </p>

              {isAdmin && (
                <div className="flex gap-4 mt-5">
                  <button
                    onClick={() => handleEdit(department)}
                    className="text-blue-700 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(department.id)}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Departments