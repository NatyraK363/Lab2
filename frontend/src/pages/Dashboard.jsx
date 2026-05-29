import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'))
  const activeRole = localStorage.getItem('activeRole')

  const [stats, setStats] = useState({
    total_users: 0,
    total_doctors: 0,
    total_departments: 0,
    total_appointments: 0,
  })

  const [doctorStats, setDoctorStats] = useState({
    total_appointments: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
  })

  useEffect(() => {
    if (activeRole === 'admin') {
      fetchStats()
    }

    if (activeRole === 'doctor') {
      fetchDoctorStats()
    }
  }, [activeRole])

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats')
      setStats(res.data)
    } catch (err) {
      console.log('Dashboard stats error:', err.response?.data)
    }
  }

  const fetchDoctorStats = async () => {
    try {
      const res = await api.get('/doctor/dashboard/stats')
      setDoctorStats(res.data)
    } catch (err) {
      console.log('Doctor stats error:', err.response?.data)
    }
  }

  if (activeRole === 'admin') {
    return (
      <div className="space-y-8">
        <div className="bg-white border rounded-2xl p-8 shadow-sm">
          <p className="text-sm text-gray-500">Logged in as admin</p>

          <h1 className="text-4xl font-bold text-blue-900 mt-2">
            Admin Dashboard
          </h1>

          <p className="text-gray-600 mt-3">
            Welcome, {user?.name}. Manage clinic data and monitor activity.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Total Users</p>
            <h2 className="text-4xl font-bold text-blue-900 mt-2">
              {stats.total_users}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Doctors</p>
            <h2 className="text-4xl font-bold text-blue-900 mt-2">
              {stats.total_doctors}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Departments</p>
            <h2 className="text-4xl font-bold text-blue-900 mt-2">
              {stats.total_departments}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Appointments</p>
            <h2 className="text-4xl font-bold text-blue-900 mt-2">
              {stats.total_appointments}
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Link
            to="/admin/users"
            className="bg-blue-900 text-white rounded-2xl p-6 hover:bg-blue-800 transition"
          >
            <h3 className="text-xl font-semibold">Manage Users</h3>
            <p className="text-blue-100 mt-2">
              Create and manage system users.
            </p>
          </Link>

          <Link
            to="/doctors"
            className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-blue-900">Doctors</h3>
            <p className="text-gray-600 mt-2">
              Add, edit and manage doctors.
            </p>
          </Link>

          <Link
            to="/departments"
            className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-blue-900">
              Departments
            </h3>
            <p className="text-gray-600 mt-2">
              Manage clinic departments.
            </p>
          </Link>

          <Link
            to="/appointments"
            className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-blue-900">
              Appointments
            </h3>
            <p className="text-gray-600 mt-2">
              View and manage appointments.
            </p>
          </Link>
        </div>
      </div>
    )
  }

  if (activeRole === 'receptionist') {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-3xl p-10 shadow-lg">
        <p className="text-blue-100 text-sm">Receptionist Dashboard</p>

        <h1 className="text-4xl font-bold mt-2">
          Welcome, {user?.name}
        </h1>

        <p className="text-blue-100 mt-3 max-w-2xl">
          Manage patient appointments, confirm visits and support daily clinic operations.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/appointments"
          className="bg-blue-900 text-white rounded-2xl p-6 hover:bg-blue-800 transition shadow-sm"
        >
          <h3 className="text-xl font-semibold">
            Manage Appointments
          </h3>

          <p className="text-blue-100 mt-2">
            Confirm, complete or cancel patient appointments.
          </p>
        </Link>

        <Link
          to="/patients"
          className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
        >
          <h3 className="text-xl font-semibold text-blue-900">
            Patients
          </h3>

          <p className="text-gray-600 mt-2">
            View patient information and appointment history.
          </p>
        </Link>

        <Link
          to="/appointments?mode=book"
          className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
        >
          <h3 className="text-xl font-semibold text-blue-900">
            Book Appointment
          </h3>

          <p className="text-gray-600 mt-2">
            Schedule an appointment for a patient.
          </p>
        </Link>
      </div>
    </div>
  )
}

  if (activeRole === 'doctor') {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-3xl p-10 shadow-lg">
          <p className="text-blue-100 text-sm">Doctor Workspace</p>

          <h1 className="text-4xl font-bold mt-2">
            Welcome, Dr. {user?.name}
          </h1>

          <p className="text-blue-100 mt-3 max-w-2xl">
            Review your appointments, follow patient visits and manage medical
            information from one place.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Total Appointments</p>
            <h2 className="text-4xl font-bold text-blue-900 mt-2">
              {doctorStats.total_appointments}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Pending</p>
            <h2 className="text-4xl font-bold text-yellow-700 mt-2">
              {doctorStats.pending}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Confirmed</p>
            <h2 className="text-4xl font-bold text-blue-900 mt-2">
              {doctorStats.confirmed}
            </h2>
          </div>

          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <p className="text-gray-500 text-sm">Completed</p>
            <h2 className="text-4xl font-bold text-green-700 mt-2">
              {doctorStats.completed}
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/appointments"
            className="bg-blue-900 text-white rounded-2xl p-6 hover:bg-blue-800 transition shadow-sm"
          >
            <h3 className="text-xl font-semibold">My Appointments</h3>
            <p className="text-blue-100 mt-2">
              View only the appointments assigned to you.
            </p>
          </Link>

          <Link
            to="/patients"
            className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-blue-900">
              My Patients
            </h3>
            <p className="text-gray-600 mt-2">
              See patients who have appointments with you.
            </p>
          </Link>

          <Link
            to="/medical-records"
            className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-blue-900">
              Medical Records
            </h3>
            <p className="text-gray-600 mt-2">
              Add diagnoses, notes and treatment records.
            </p>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-3xl p-10 shadow-lg">
        <p className="text-blue-100 text-sm">Patient Dashboard</p>

        <h1 className="text-4xl font-bold mt-2">
          Welcome, {user?.name}
        </h1>

        <p className="text-blue-100 mt-3 max-w-2xl">
          From here you can book appointments and follow your clinic activity.
        </p>
      </div>

      <div className="grid md:grid-cols-1 gap-6">
        <Link
          to="/appointments?mode=book"
          className="bg-blue-900 text-white rounded-2xl p-6 hover:bg-blue-800 transition shadow-sm"
        >
          <h3 className="text-xl font-semibold">Book Appointment</h3>
          <p className="text-blue-100 mt-2">
            Choose department, doctor, date and time.
          </p>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-blue-900">
            My Appointments
          </h2>

          <p className="text-gray-600 mt-2">
            Check your booked appointments and their current status.
          </p>

          <Link
            to="/appointments"
            className="inline-block mt-5 bg-blue-50 text-blue-800 px-4 py-2 rounded-lg"
          >
            View Appointments
          </Link>
        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-blue-900">Need Help?</h2>

          <p className="text-gray-600 mt-2">
            If your appointment is pending, wait for admin or receptionist
            confirmation.
          </p>

          <p className="text-sm text-gray-500 mt-4">
            Status examples: pending, confirmed, completed, cancelled.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard