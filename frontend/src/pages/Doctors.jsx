import { useEffect, useState } from 'react'
import api from '../api/axios'

function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])
  const [specialties, setSpecialties] = useState([])
  const [users, setUsers] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
const [departmentFilter, setDepartmentFilter] = useState('')
const [sortOrder, setSortOrder] = useState('az')

  const [form, setForm] = useState({
    user_id: '',
    first_name: '',
    last_name: '',
    qualification: '',
    department_id: '',
    specialty_id: '',
    phone: '',
    license_number: '',
    experience_years: '',
    bio: '',
  })

  const activeRole = localStorage.getItem('activeRole')
  const isAdmin = activeRole === 'admin'

  const resetForm = () => {
    setForm({
      user_id: '',
      first_name: '',
      last_name: '',
      qualification: '',
      department_id: '',
      specialty_id: '',
      phone: '',
      license_number: '',
      experience_years: '',
      bio: '',
    })

    setEditingId(null)
    setError('')
  }

  const fetchDoctors = async () => {
  try {
    const res = await api.get('/doctors', {
      params: {
        search,
        department_id: departmentFilter,
      },
    })

    setDoctors(res.data)
  } catch (err) {
    console.log('Fetch doctors error:', err.response?.data)
  }
}

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments')
      setDepartments(res.data)
    } catch (err) {
      console.log('Fetch departments error:', err.response?.data)
    }
  }

  const fetchSpecialties = async () => {
    try {
      const res = await api.get('/specialties')
      setSpecialties(res.data)
    } catch (err) {
      console.log('Fetch specialties error:', err.response?.data)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data)
    } catch (err) {
      console.log('Fetch users error:', err.response?.data)
    }
  }

  useEffect(() => {
  fetchDepartments()
  fetchSpecialties()

  if (isAdmin) {
    fetchUsers()
  }
}, [isAdmin])

useEffect(() => {
  fetchDoctors()
}, [search, departmentFilter])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (editingId) {
        await api.put(`/doctors/${editingId}`, form)
      } else {
        await api.post('/doctors', form)
      }

      resetForm()
      fetchDoctors()
    } catch (err) {
      console.log('Doctor save error:', err.response?.data)

      if (err.response?.status === 401) {
        setError('You are not authorized. Please login again as admin.')
      } else if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0]
        setError(firstError)
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Doctor could not be saved.')
      }
    }
  }

  const handleEdit = (doctor) => {
    setEditingId(doctor.id)
    setError('')

    setForm({
      user_id: doctor.user_id || '',
      first_name: doctor.first_name || '',
      last_name: doctor.last_name || '',
      qualification: doctor.qualification || '',
      department_id: doctor.department_id || '',
      specialty_id: doctor.specialty_id || '',
      phone: doctor.phone || '',
      license_number: doctor.license_number || '',
      experience_years: doctor.experience_years || '',
      bio: doctor.bio || '',
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/doctors/${id}`)
      fetchDoctors()
    } catch (err) {
      console.log('Doctor delete error:', err.response?.data)
      setError('Doctor could not be deleted.')
    }
  }

  const doctorUsers = users.filter((user) =>
    user.roles?.some((role) => role.name === 'doctor')
  )

  const filteredDoctors = doctors
  .filter((doctor) => {
    const fullName =
      `${doctor.first_name} ${doctor.last_name}`.toLowerCase()

    const specialty =
      doctor.specialty?.name?.toLowerCase() || ''

    const department =
      doctor.department?.name?.toLowerCase() || ''

    const searchText = search.toLowerCase()

    const matchesSearch =
      fullName.includes(searchText) ||
      specialty.includes(searchText) ||
      department.includes(searchText)

    const matchesDepartment = departmentFilter
      ? String(doctor.department_id) === departmentFilter
      : true

    return matchesSearch && matchesDepartment
  })
  .sort((a, b) => {
    const nameA = `${a.first_name} ${a.last_name}`
    const nameB = `${b.first_name} ${b.last_name}`

    return sortOrder === 'az'
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA)
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">Doctors</h1>
        <p className="text-gray-600 mt-2">
          View, add, edit and delete clinic doctors.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl">
          {error}
        </div>
      )}

      {isAdmin && (
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-5">
            {editingId ? 'Edit Doctor' : 'Add Doctor'}
          </h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <select
              className="border p-3 rounded-lg md:col-span-2"
              value={form.user_id}
              onChange={(e) =>
                setForm({ ...form, user_id: e.target.value })
              }
            >
              <option value="">Select doctor user account</option>
              {doctorUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.email}
                </option>
              ))}
            </select>

            <input
              className="border p-3 rounded-lg"
              placeholder="First name"
              value={form.first_name}
              onChange={(e) =>
                setForm({ ...form, first_name: e.target.value })
              }
            />

            <input
              className="border p-3 rounded-lg"
              placeholder="Last name"
              value={form.last_name}
              onChange={(e) =>
                setForm({ ...form, last_name: e.target.value })
              }
            />

            <select
              className="border p-3 rounded-lg"
              value={form.qualification}
              onChange={(e) =>
                setForm({ ...form, qualification: e.target.value })
              }
            >
              <option value="">Select qualification</option>
              <option value="Bachelor">Bachelor</option>
              <option value="Master">Master</option>
              <option value="PhD">PhD</option>
              <option value="MD">MD</option>
              <option value="Professor">Professor</option>
            </select>

            <select
              className="border p-3 rounded-lg"
              value={form.department_id}
              onChange={(e) =>
                setForm({ ...form, department_id: e.target.value })
              }
            >
              <option value="">Select department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>

            <select
              className="border p-3 rounded-lg"
              value={form.specialty_id}
              onChange={(e) =>
                setForm({ ...form, specialty_id: e.target.value })
              }
            >
              <option value="">Select specialty</option>
              {specialties.map((specialty) => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </option>
              ))}
            </select>

            <input
              type="tel"
              className="border p-3 rounded-lg"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <input
              className="border p-3 rounded-lg"
              placeholder="License number"
              value={form.license_number}
              onChange={(e) =>
                setForm({ ...form, license_number: e.target.value })
              }
            />

            <input
              className="border p-3 rounded-lg"
              placeholder="Experience years"
              type="number"
              value={form.experience_years}
              onChange={(e) =>
                setForm({ ...form, experience_years: e.target.value })
              }
            />

            <textarea
              className="border p-3 rounded-lg md:col-span-2"
              placeholder="Bio"
              rows="4"
              value={form.bio}
              onChange={(e) =>
                setForm({ ...form, bio: e.target.value })
              }
            />

            <div className="md:col-span-2 flex gap-3">
              <button className="bg-blue-900 text-white px-6 py-3 rounded-lg">
                {editingId ? 'Update Doctor' : 'Save Doctor'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
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
    Search & Filter Doctors
  </h2>

  <div className="grid md:grid-cols-3 gap-4">
    <input
      className="border p-3 rounded-lg"
      placeholder="Search doctor, specialty..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <select
      className="border p-3 rounded-lg"
      value={departmentFilter}
      onChange={(e) => setDepartmentFilter(e.target.value)}
    >
      <option value="">All Departments</option>

      {departments.map((department) => (
        <option
          key={department.id}
          value={department.id}
        >
          {department.name}
        </option>
      ))}
    </select>

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
    Showing {filteredDoctors.length} of {doctors.length} doctors
  </p>
</div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-white border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-blue-900">
              Dr. {doctor.first_name} {doctor.last_name}
            </h3>

            <p className="text-gray-600 mt-2">
              User Account: {doctor.user?.email || 'Not linked'}
            </p>

            <p className="text-gray-600">
              Department: {doctor.department?.name || 'Not assigned'}
            </p>

            <p className="text-gray-600">
              Specialty: {doctor.specialty?.name || 'Not assigned'}
            </p>

            <p className="text-gray-600">
              Qualification: {doctor.qualification || 'Not assigned'}
            </p>

            <p className="text-gray-600">
              Phone: {doctor.phone}
            </p>

            <p className="text-gray-600">
              License: {doctor.license_number}
            </p>

            <p className="text-gray-600">
              Experience: {doctor.experience_years} years
            </p>

            {doctor.bio && (
              <p className="text-gray-600 mt-3">
                {doctor.bio}
              </p>
            )}

            {isAdmin && (
              <div className="flex gap-4 mt-5">
                <button
                  onClick={() => handleEdit(doctor)}
                  className="text-blue-700 text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(doctor.id)}
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

export default Doctors