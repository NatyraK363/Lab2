import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../api/axios'

function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const location = useLocation()
  const isBookMode = location.search.includes('mode=book')

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
  const isDoctor = activeRole === 'doctor'
  const isReceptionist = activeRole === 'receptionist'
  const isPatient = activeRole === 'patient'

  const canBookAppointment = isPatient || isAdmin || isReceptionist
  const canManageAppointment = isAdmin || isReceptionist

  const resetForm = () => {
    setForm({
      department_id: '',
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
    try {
      const res = await api.get('/departments')
      setDepartments(res.data)
    } catch (err) {
      console.log('Fetch departments error:', err.response?.data)
    }
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
    setSuccess('')

    try {
      await api.post('/appointments', {
        doctor_id: form.doctor_id,
        appointment_date: form.appointment_date,
        appointment_time: form.appointment_time,
        reason: form.reason,
        notes: form.notes,
      })

      resetForm()
      fetchAppointments()
      setSuccess('Appointment booked successfully. Please wait for confirmation.')
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

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status })
      fetchAppointments()
    } catch (err) {
      console.log('Appointment status error:', err.response?.data)
      setError('Appointment status could not be updated.')
    }
  }

  const getStatusClass = (status) => {
    if (status === 'confirmed') return 'bg-blue-50 text-blue-800'
    if (status === 'completed') return 'bg-green-50 text-green-800'
    if (status === 'cancelled') return 'bg-red-50 text-red-800'
    return 'bg-yellow-50 text-yellow-800'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">
          {isBookMode ? 'Book Appointment' : 'My Appointments'}
        </h1>

        <p className="text-gray-600 mt-2">
          {isBookMode
            ? 'Choose department, doctor, date and time.'
            : 'View booked appointments and their current status.'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 border border-green-100 p-4 rounded-xl">
          {success}
        </div>
      )}

      {canBookAppointment && isBookMode && (
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
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
              onChange={(e) => setForm({ ...form, doctor_id: e.target.value })}
            >
              <option value="">Select doctor</option>
              {doctors
                .filter((doctor) =>
                  form.department_id
                    ? String(doctor.department_id) === String(form.department_id)
                    : true
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
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />

            <textarea
              className="border p-3 rounded-lg md:col-span-2"
              placeholder="Notes"
              rows="3"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />

            <button className="bg-blue-900 text-white px-6 py-3 rounded-lg md:col-span-2">
              Book Appointment
            </button>
          </form>
        </div>
      )}

      {!isBookMode && (
        <div className="bg-white border rounded-2xl overflow-hidden">
          {appointments.length === 0 ? (
            <p className="p-5 text-gray-500">No appointments found.</p>
          ) : (
            appointments.map((appointment) => (
              <div key={appointment.id} className="p-5 border-b">
                <h3 className="font-semibold text-blue-900">
                  {isDoctor || isAdmin || isReceptionist
                  ? `Patient: ${appointment.patient?.user?.name || 'Unknown patient'}`
                   : `Dr. ${appointment.doctor?.first_name || ''} ${appointment.doctor?.last_name || ''}`}
                </h3>

                {(isAdmin || isReceptionist) && (
                <p className="text-sm text-gray-600">
                Doctor: Dr. {appointment.doctor?.first_name} {appointment.doctor?.last_name}
               </p>
               )}

                <p className="text-sm text-gray-600">
                  Date: {appointment.appointment_date} at {appointment.appointment_time}
                </p>

                <p className="text-sm text-gray-600">
                  Reason: {appointment.reason || 'No reason'}
                </p>

                {appointment.notes && (
                  <p className="text-sm text-gray-600">
                    Notes: {appointment.notes}
                  </p>
                )}

                <span
                  className={`inline-block mt-2 text-xs px-2 py-1 rounded capitalize ${getStatusClass(
                    appointment.status
                  )}`}
                >
                  {appointment.status}
                </span>

                {isDoctor && (
                  <button
                    onClick={() => {
                      window.location.href = '/patients'
                    }}
                    className="block mt-4 bg-blue-900 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Add Diagnosis
                  </button>
                )}

                {canManageAppointment && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <button
                      onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm"
                    >
                      Confirm
                    </button>

                    <button
                      onClick={() => handleStatusChange(appointment.id, 'completed')}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm"
                    >
                      Complete
                    </button>

                    <button
                      onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Appointments