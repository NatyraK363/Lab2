import { useEffect, useState } from 'react'
import api from '../api/axios'

function Patients() {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [bloodFilter, setBloodFilter] = useState('')
  const [sortOrder, setSortOrder] = useState('az')

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

  const filteredPatients = patients
    .filter((patient) => {
      const name = patient.user?.name?.toLowerCase() || ''
      const phone = patient.phone?.toLowerCase() || ''
      const address = patient.address?.toLowerCase() || ''
      const searchText = search.toLowerCase()

      const matchesSearch =
        name.includes(searchText) ||
        phone.includes(searchText) ||
        address.includes(searchText)

      const matchesGender = genderFilter
        ? patient.gender === genderFilter
        : true

      const matchesBlood = bloodFilter
        ? patient.blood_type === bloodFilter
        : true

      return matchesSearch && matchesGender && matchesBlood
    })
    .sort((a, b) => {
      const nameA = a.user?.name || ''
      const nameB = b.user?.name || ''

      return sortOrder === 'az'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA)
    })

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

      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">
          Search & Filter Patients
        </h2>

        <div className="grid md:grid-cols-4 gap-4">
          <input
            className="border p-3 rounded-lg"
            placeholder="Search name, phone or address"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border p-3 rounded-lg"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="">All Genders</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="unknown">Unknown</option>
          </select>

          <select
            className="border p-3 rounded-lg"
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
          >
            <option value="">All Blood Types</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
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
          Showing {filteredPatients.length} of {patients.length} patients
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredPatients.map((patient) => (
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