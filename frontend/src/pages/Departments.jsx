import { useEffect, useState } from 'react'
import api from '../api/axios'

function Departments() {
  const [departments, setDepartments] = useState([])
  const [form, setForm] = useState({
    name: '',
    description: '',
  })

  const user = JSON.parse(localStorage.getItem('user'))

  const isAdmin =
    user?.roles?.some((role) => role.name === 'admin')

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments')
      setDepartments(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await api.post('/departments', form)

      setForm({
        name: '',
        description: '',
      })

      fetchDepartments()
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/departments/${id}`)
      fetchDepartments()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">
          Departments
        </h1>

        <p className="text-gray-600 mt-2">
          View clinic departments and available services.
        </p>
      </div>

      {isAdmin && (
        <div className="bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-5">
            Add Department
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Department name"
              className="w-full border p-3 rounded-lg"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <textarea
              placeholder="Department description"
              className="w-full border p-3 rounded-lg"
              rows="4"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <button className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800">
              Save Department
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {departments.map((department) => (
          <div
            key={department.id}
            className="bg-white border rounded-2xl p-6"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-xl font-semibold text-blue-900">
                  {department.name}
                </h3>

                <p className="text-gray-600 mt-3">
                  {department.description || 'No description available.'}
                </p>
              </div>

              {isAdmin && (
                <button
                  onClick={() => handleDelete(department.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Departments