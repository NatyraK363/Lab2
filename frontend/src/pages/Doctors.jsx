import { useEffect, useState } from 'react'
import api from '../api/axios'

function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])
  const [specialties, setSpecialties] = useState([])

  const [form, setForm] = useState({
    department_id: '',
    specialty_id: '',
    phone: '',
    license_number: '',
    experience_years: '',
    bio: '',
  })

  const activeRole = localStorage.getItem('activeRole')
  const isAdmin = activeRole === 'admin'

  const fetchDoctors = async () => {
    const res = await api.get('/doctors')
    setDoctors(res.data)
  }

  const fetchDepartments = async () => {
    const res = await api.get('/departments')
    setDepartments(res.data)
  }

  const fetchSpecialties = async () => {
    const res = await api.get('/specialties')
    setSpecialties(res.data)
  }

  useEffect(() => {
    fetchDoctors()
    fetchDepartments()
    fetchSpecialties()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    await api.post('/doctors', form)

    setForm({
      department_id: '',
      specialty_id: '',
      phone: '',
      license_number: '',
      experience_years: '',
      bio: '',
    })

    fetchDoctors()
  }

  const handleDelete = async (id) => {
    await api.delete(`/doctors/${id}`)
    fetchDoctors()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">Doctors</h1>
        <p className="text-gray-600 mt-2">
          View doctors and their clinic specialties.
        </p>
      </div>

      {isAdmin && (
        <div className="bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-5">Add Doctor</h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <select
              className="border p-3 rounded-lg"
              value={form.department_id}
              onChange={(e) => setForm({ ...form, department_id: e.target.value })}
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
              onChange={(e) => setForm({ ...form, specialty_id: e.target.value })}
            >
              <option value="">Select specialty</option>
              {specialties.map((specialty) => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </option>
              ))}
            </select>

            <input
              className="border p-3 rounded-lg"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <input
              className="border p-3 rounded-lg"
              placeholder="License number"
              value={form.license_number}
              onChange={(e) => setForm({ ...form, license_number: e.target.value })}
            />

            <input
              className="border p-3 rounded-lg"
              placeholder="Experience years"
              type="number"
              value={form.experience_years}
              onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
            />

            <textarea
              className="border p-3 rounded-lg md:col-span-2"
              placeholder="Bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />

            <button className="bg-blue-900 text-white px-6 py-3 rounded-lg md:col-span-2">
              Save Doctor
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white border rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-blue-900">
              Dr. {doctor.user?.name || 'Doctor'}
            </h3>

            <p className="text-gray-600 mt-2">
              Department: {doctor.department?.name || 'Not assigned'}
            </p>

            <p className="text-gray-600">
              Specialty: {doctor.specialty?.name || 'Not assigned'}
            </p>

            <p className="text-gray-600">
              Phone: {doctor.phone}
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
              <button
                onClick={() => handleDelete(doctor.id)}
                className="text-red-500 text-sm mt-4"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Doctors