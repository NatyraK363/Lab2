import { useEffect, useState } from 'react'
import api from '../api/axios'

function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [error, setError] = useState('')
  const [departments, setDepartments] = useState([])

  const [form, setForm] = useState({
    department_id: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    reason: '',
    notes: '',
  })

  

  const activeRole = localStorage.getItem('activeRole')
  const isAdmin = activeRole === 'admin'
  const isPatient = activeRole === 'patient'

  const resetForm = () => {
    setForm({
      doctor_id: '',
      appointment_date: '',
      appointment_time: '',
      reason: '',
      notes: '',
    })
  }

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments')
      setAppointments(res.data)
    } catch (err) {
      console.log('Fetch appointments error:', err.response?.data)
    }
  }

  const fetchDepartments = async () => {
  const res = await api.get('/departments')
  setDepartments(res.data)
}

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors')
      setDoctors(res.data)
    } catch (err) {
      console.log('Fetch doctors error:', err.response?.data)
    }
  }

  useEffect(() => {
    fetchAppointments()
    fetchDoctors()
    fetchDepartments()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await api.post('/appointments', form)

      resetForm()
      fetchAppointments()
    } catch (err) {
      console.log('Appointment save error:', err.response?.data)

      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0]
        setError(firstError)
      } else {
        setError('Appointment could not be saved.')
      }
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/appointments/${id}`)
      fetchAppointments()
    } catch (err) {
      console.log('Appointment delete error:', err.response?.data)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">Appointments</h1>
        <p className="text-gray-600 mt-2">
          Book and manage clinic appointments.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl">
          {error}
        </div>
      )}

      {(isPatient || isAdmin) && (
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-5">Book Appointment</h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <select
               className="border p-3 rounded-lg"
               value={form.department_id}
               onChange={(e) =>
               setForm({ ...form, department_id: e.target.value, doctor_id: '' })
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
              value={form.doctor_id}
              onChange={(e) =>
                setForm({ ...form, doctor_id: e.target.value })
              }
            >
              <option value="">Select doctor</option>
              {doctors.filter((doctor) =>form.department_id ? String(doctor.department_id) === String(form.department_id) : true
               )
              .map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.first_name} {doctor.last_name}
                </option>
              ))}
            </select>

            <input
              className="border p-3 rounded-lg"
              type="date"
              value={form.appointment_date}
              onChange={(e) =>
                setForm({ ...form, appointment_date: e.target.value })
              }
            />

            <input
              className="border p-3 rounded-lg"
              type="time"
              value={form.appointment_time}
              onChange={(e) =>
                setForm({ ...form, appointment_time: e.target.value })
              }
            />

            <input
              className="border p-3 rounded-lg"
              placeholder="Reason"
              value={form.reason}
              onChange={(e) =>
                setForm({ ...form, reason: e.target.value })
              }
            />

            <textarea
              className="border p-3 rounded-lg md:col-span-2"
              placeholder="Notes"
              rows="3"
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
            />

            <button className="bg-blue-900 text-white px-6 py-3 rounded-lg md:col-span-2">
              Save Appointment
            </button>
          </form>
        </div>
      )}

      <div className="bg-white border rounded-2xl overflow-hidden">
        {appointments.length === 0 ? (
          <p className="p-5 text-gray-500">No appointments found.</p>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-5 border-b flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-blue-900">
                  Dr. {appointment.doctor?.first_name} {appointment.doctor?.last_name}
                </h3>

                <p className="text-sm text-gray-600">
                  Date: {appointment.appointment_date} at {appointment.appointment_time}
                </p>

                <p className="text-sm text-gray-600">
                  Reason: {appointment.reason || 'No reason'}
                </p>

                <span className="inline-block mt-2 bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded capitalize">
                  {appointment.status}
                </span>
              </div>

              {isAdmin && (
                <button
                  onClick={() => handleDelete(appointment.id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Appointments