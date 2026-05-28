import { useEffect, useState } from 'react'
import api from '../api/axios'

function Departments() {
  const [departments, setDepartments] = useState([])
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

      <div className="grid md:grid-cols-2 gap-6">
        {departments.map((department) => (
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
        ))}
      </div>
    </div>
  )
}

export default Departments