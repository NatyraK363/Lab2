import { useEffect, useState } from 'react'
import api from '../api/axios'

function MedicalRecords() {
  const [patients, setPatients] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingRecordId, setEditingRecordId] = useState(null)

  const [form, setForm] = useState({
    patient_id: '',
    appointment_id: '',
    diagnosis: '',
    prescription: '',
    notes: '',
  })

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const res = await api.get('/medical-records')
      setPatients(res.data)
    } catch (err) {
      console.log('Medical records error:', err.response?.data)
      setError('Could not load patients.')
    }
  }

  const resetForm = () => {
    setForm({
      patient_id: '',
      appointment_id: '',
      diagnosis: '',
      prescription: '',
      notes: '',
    })

    setEditingRecordId(null)
  }

  const handleSelectAppointment = (patient, appointment) => {
    setForm({
      patient_id: patient.id,
      appointment_id: appointment.id,
      diagnosis: '',
      prescription: '',
      notes: '',
    })

    setEditingRecordId(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEditRecord = (record, patientId, appointmentId) => {
    setEditingRecordId(record.id)

    setForm({
      patient_id: patientId,
      appointment_id: appointmentId,
      diagnosis: record.diagnosis || '',
      prescription: record.prescription || '',
      notes: record.notes || '',
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteRecord = async (id) => {
    if (!window.confirm('Delete this medical record?')) {
      return
    }

    setError('')
    setSuccess('')

    try {
      await api.delete(`/medical-records/${id}`)
      setSuccess('Medical record deleted successfully.')
      fetchPatients()
    } catch (err) {
      console.log('Delete medical record error:', err.response?.data)
      setError('Medical record could not be deleted.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      if (editingRecordId) {
        await api.put(`/medical-records/${editingRecordId}`, form)
        setSuccess('Medical record updated successfully.')
      } else {
        await api.post('/medical-records', form)
        setSuccess('Medical record saved successfully.')
      }

      resetForm()
      fetchPatients()
    } catch (err) {
      console.log('Save medical record error:', err.response?.data)

      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0]
        setError(firstError)
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Medical record could not be saved.')
      }
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">
          Medical Records
        </h1>

        <p className="text-gray-600 mt-2">
          Add, edit and delete diagnoses, prescriptions and notes for your patients.
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

      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-blue-900 mb-5">
          {editingRecordId ? 'Edit Medical Record' : 'Add Medical Record'}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            className="border p-3 rounded-lg bg-gray-50"
            placeholder="Patient ID"
            value={form.patient_id}
            readOnly
          />

          <input
            className="border p-3 rounded-lg bg-gray-50"
            placeholder="Appointment ID"
            value={form.appointment_id}
            readOnly
          />

          <textarea
            className="border p-3 rounded-lg"
            placeholder="Diagnosis"
            rows="3"
            value={form.diagnosis}
            onChange={(e) =>
              setForm({ ...form, diagnosis: e.target.value })
            }
          />

          <textarea
            className="border p-3 rounded-lg"
            placeholder="Prescription"
            rows="3"
            value={form.prescription}
            onChange={(e) =>
              setForm({ ...form, prescription: e.target.value })
            }
          />

          <textarea
            className="border p-3 rounded-lg"
            placeholder="Notes"
            rows="3"
            value={form.notes}
            onChange={(e) =>
              setForm({ ...form, notes: e.target.value })
            }
          />

          <div className="flex gap-3">
            <button className="bg-blue-900 text-white px-6 py-3 rounded-lg">
              {editingRecordId ? 'Update Medical Record' : 'Save Medical Record'}
            </button>

            {editingRecordId && (
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

      <div className="grid md:grid-cols-2 gap-6">
        {patients.length === 0 ? (
          <div className="bg-white border rounded-2xl p-6 text-gray-500">
            No patients found.
          </div>
        ) : (
          patients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white border rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-blue-900">
                {patient.user?.name}
              </h3>

              <p className="text-gray-600 mt-2">
                Phone: {patient.phone}
              </p>

              <div className="mt-5 space-y-4">
                {patient.appointments?.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border rounded-xl p-4 bg-gray-50"
                  >
                    <p className="text-sm text-gray-600">
                      Date: {appointment.appointment_date} at {appointment.appointment_time}
                    </p>

                    <p className="text-sm text-gray-600">
                      Status: {appointment.status}
                    </p>

                    <button
                      onClick={() =>
                        handleSelectAppointment(patient, appointment)
                      }
                      className="mt-3 bg-blue-900 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Add Diagnosis
                    </button>

                    {appointment.medical_records?.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="font-semibold text-blue-900 text-sm">
                          Existing Records
                        </p>

                        {appointment.medical_records.map((record) => (
                          <div
                            key={record.id}
                            className="bg-white border rounded-lg p-3 text-sm"
                          >
                            <p>
                              <strong>Diagnosis:</strong> {record.diagnosis}
                            </p>

                            {record.prescription && (
                              <p>
                                <strong>Prescription:</strong> {record.prescription}
                              </p>
                            )}

                            {record.notes && (
                              <p>
                                <strong>Notes:</strong> {record.notes}
                              </p>
                            )}

                            <div className="flex gap-3 mt-3">
                              <button
                                onClick={() =>
                                  handleEditRecord(
                                    record,
                                    patient.id,
                                    appointment.id
                                  )
                                }
                                className="text-blue-700 text-xs"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteRecord(record.id)
                                }
                                className="text-red-600 text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MedicalRecords