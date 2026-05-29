import { useEffect, useState } from 'react'
import api from '../api/axios'

function Patients() {
  const [patients, setPatients] = useState([])

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const res = await api.get('/patients')
      setPatients(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">
          Patients
        </h1>

        <p className="text-gray-600 mt-2">
          View patient information.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {patients.map((patient) => (
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

            <p className="text-gray-600">
              Gender: {patient.gender}
            </p>

            <p className="text-gray-600">
              Blood Type: {patient.blood_type || 'N/A'}
            </p>

            <p className="text-gray-600">
              Address: {patient.address || 'N/A'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Patients