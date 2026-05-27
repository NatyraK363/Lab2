import { Link } from 'react-router-dom'

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'))
  const activeRole = localStorage.getItem('activeRole')

  const cards = {
    admin: [
      { title: 'Users', text: 'Manage users and roles', link: '/admin/users' },
      { title: 'Departments', text: 'Manage clinic departments', link: '/departments' },
      { title: 'Doctors', text: 'Manage doctors', link: '/doctors' },
      { title: 'Appointments', text: 'View all appointments', link: '/appointments' },
    ],
    doctor: [
      { title: 'My Appointments', text: 'View your appointments', link: '/doctor/appointments' },
      { title: 'Patients', text: 'View assigned patients', link: '/doctor/patients' },
      { title: 'Medical Records', text: 'Manage medical records', link: '/medical-records' },
    ],
    receptionist: [
      { title: 'Appointments', text: 'Create and manage appointments', link: '/appointments' },
      { title: 'Patients', text: 'Register and manage patients', link: '/patients' },
      { title: 'Payments', text: 'Manage invoices and payments', link: '/payments' },
    ],
    patient: [
      { title: 'Departments', text: 'View clinic departments', link: '/departments' },
      { title: 'Doctors', text: 'Find available doctors', link: '/doctors' },
      { title: 'Book Appointment', text: 'Request a new appointment', link: '/appointments/create' },
      { title: 'My Appointments', text: 'View your appointments', link: '/my-appointments' },
    ],
  }

  const activeCards = cards[activeRole] || []

  return (
    <div className="space-y-8">
      <div className="bg-white border rounded-2xl p-8">
        <p className="text-sm text-gray-500 capitalize">
          Logged in as {activeRole}
        </p>

        <h1 className="text-3xl font-bold text-blue-900 mt-1">
          Welcome, {user?.name}
        </h1>

        <p className="text-gray-600 mt-2">
          Choose an option below to continue.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {activeCards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-blue-900">
              {card.title}
            </h3>

            <p className="text-gray-600 mt-2">
              {card.text}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Dashboard