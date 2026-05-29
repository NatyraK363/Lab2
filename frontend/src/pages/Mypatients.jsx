import { useEffect, useState } from 'react'
import api from '../api/axios'

function MyPatients() {
  const [patients, setPatients] = useState([])
  const [selectedVisits, setSelectedVisits] = useState({})
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const [form, setForm] = useState({
    diagnosis: '',
    prescription: '',
    notes: '',
  })

  const fetchPatients = async () => {
    const res = await api.get('/doctor/my-patients')
    setPatients(res.data)

    const defaults = {}

    res.data.forEach((patient) => {
      if (patient.appointments?.length > 0) {
        defaults[patient.id] = patient.appointments[0].id
      }
    })

    setSelectedVisits(defaults)
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    await api.post('/medical-records', {
      patient_id: selectedAppointment.patient_id,
      appointment_id: selectedAppointment.id,
      diagnosis: form.diagnosis,
      prescription: form.prescription,
      notes: form.notes,
    })

    setForm({
      diagnosis: '',
      prescription: '',
      notes: '',
    })

    setSelectedAppointment(null)
    fetchPatients()
  }

  const getSelectedAppointment = (patient) => {
    return patient.appointments.find(
      (appointment) =>
        String(appointment.id) === String(selectedVisits[patient.id])
    )
  }

  const getLatestRecord = (appointment) => {
    if (!appointment?.medical_records?.length) {
      return null
    }

    return appointment.medical_records[appointment.medical_records.length - 1]
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">
          My Patients
        </h1>

        <p className="text-gray-600 mt-2">
          Select a visit date to view the diagnosis, prescription and notes.
        </p>
      </div>

      {selectedAppointment && (
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            Add Diagnosis
          </h2>

          <p className="text-gray-600 mb-4">
            Visit: {selectedAppointment.appointment_date} at{' '}
            {selectedAppointment.appointment_time}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              className="w-full border p-3 rounded-lg"
              placeholder="Diagnosis"
              value={form.diagnosis}
              onChange={(e) =>
                setForm({ ...form, diagnosis: e.target.value })
              }
            />

            <textarea
              className="w-full border p-3 rounded-lg"
              placeholder="Prescription"
              value={form.prescription}
              onChange={(e) =>
                setForm({ ...form, prescription: e.target.value })
              }
            />

            <textarea
              className="w-full border p-3 rounded-lg"
              placeholder="Notes"
              value={form.notes}
              onChange={(e) =>
                setForm({ ...form, notes: e.target.value })
              }
            />

            <div className="flex gap-3">
              <button className="bg-blue-900 text-white px-6 py-3 rounded-lg">
                Save Diagnosis
              </button>

              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="border px-6 py-3 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {patients.length === 0 ? (
          <div className="bg-white border rounded-2xl p-6 text-gray-500">
            No patients found.
          </div>
        ) : (
          patients.map((patient) => {
            const selected = getSelectedAppointment(patient)
            const record = getLatestRecord(selected)

            return (
              <div
                key={patient.id}
                className="bg-white border rounded-2xl p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-blue-900">
                  {patient.user?.name}
                </h2>

                <p className="text-gray-600 mt-1">
                  Phone: {patient.phone}
                </p>

                <div className="mt-5">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Select visit date
                  </label>

                  <select
                    className="w-full border p-3 rounded-lg"
                    value={selectedVisits[patient.id] || ''}
                    onChange={(e) =>
                      setSelectedVisits({
                        ...selectedVisits,
                        [patient.id]: e.target.value,
                      })
                    }
                  >
                    {patient.appointments.map((appointment) => (
                      <option key={appointment.id} value={appointment.id}>
                        {appointment.appointment_date} at{' '}
                        {appointment.appointment_time}
                      </option>
                    ))}
                  </select>
                </div>

                {selected && (
                  <div className="mt-5 border rounded-xl p-5 bg-gray-50">
                    <p className="font-medium text-blue-900">
                      Visit Date: {selected.appointment_date} at{' '}
                      {selected.appointment_time}
                    </p>

                    <p className="text-sm text-gray-600 capitalize mt-1">
                      Status: {selected.status}
                    </p>

                    <div className="mt-4 bg-white border rounded-lg p-4">
                      <p className="text-sm">
                        <span className="font-semibold">Diagnosis:</span>{' '}
                        {record?.diagnosis || 'No diagnosis added for this visit.'}
                      </p>

                      <p className="text-sm mt-2">
                        <span className="font-semibold">Prescription:</span>{' '}
                        {record?.prescription || 'N/A'}
                      </p>

                      <p className="text-sm mt-2">
                        <span className="font-semibold">Notes:</span>{' '}
                        {record?.notes || 'N/A'}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedAppointment(selected)}
                      className="mt-4 bg-blue-900 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Add Diagnosis
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default MyPatients