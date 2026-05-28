import { Link } from 'react-router-dom'

function Home() {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))
  const activeRole = localStorage.getItem('activeRole')

  const isAdmin = activeRole === 'admin'

  if (token && user) {
    return (
      <div className="space-y-8">
        <div className="bg-white border rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-blue-900">
            Welcome back, {user.name}
          </h1>

          <p className="text-gray-600 mt-2">
            Manage your clinic activities from here.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/departments"
            className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-blue-900">
              Departments
            </h3>

            <p className="text-gray-600 mt-2">
              View clinic departments.
            </p>
          </Link>

         

          <Link
            to="/doctors"
            className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-blue-900">
              Doctors
            </h3>

            <p className="text-gray-600 mt-2">
              Check available doctors.
            </p>
          </Link>

          <Link
            to="/appointments"
            className="bg-blue-900 text-white rounded-2xl p-6 hover:bg-blue-800 transition"
          >
            <h3 className="text-xl font-semibold">
              Book Appointment
            </h3>

            <p className="text-blue-100 mt-2">
              Request a new appointment.
            </p>
          </Link>

          {isAdmin && (
            <>
              <Link
                to="/admin/users"
                className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold text-blue-900">
                  Users
                </h3>

                <p className="text-gray-600 mt-2">
                  Manage clinic users and roles.
                </p>
              </Link>

              <Link
                to="/dashboard"
                className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold text-blue-900">
                  Dashboard
                </h3>

                <p className="text-gray-600 mt-2">
                  View clinic statistics and management tools.
                </p>
              </Link>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-3xl p-14 shadow-lg">
        <h1 className="text-5xl font-bold mb-6">
          SmartCare Clinic Management System
        </h1>

        <p className="text-lg text-blue-100 max-w-2xl">
          A modern clinic management system for appointments, patient records,
          doctor schedules and healthcare administration.
        </p>

        <div className="flex gap-4 mt-8">
          <Link
            to="/login"
            className="bg-white text-blue-900 px-6 py-3 rounded-xl font-semibold"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="border border-white px-6 py-3 rounded-xl font-semibold"
          >
            Register
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home