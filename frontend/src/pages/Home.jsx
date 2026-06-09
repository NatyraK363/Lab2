import { Link } from 'react-router-dom'
import home from '../assets/images/home.png'

function Home() {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))
  const activeRole = localStorage.getItem('activeRole')


  const isAdmin = activeRole === 'admin'
  const isDoctor = activeRole === 'doctor'
  const isReceptionist = activeRole === 'receptionist'
  const isPatient = activeRole === 'patient'

  if (token && user && isDoctor) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-3xl p-10 shadow-lg">
          <p className="text-blue-100 text-sm">Doctor Home</p>

          <h1 className="text-4xl font-bold mt-2">
            Welcome, Dr. {user.name}
          </h1>

          <p className="text-blue-100 mt-3">
            Access your dashboard, appointments, patients and medical records.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/dashboard"
            className="bg-blue-900 text-white rounded-2xl p-6 hover:bg-blue-800 transition"
          >
            <h3 className="text-xl font-semibold">Doctor Dashboard</h3>
            <p className="text-blue-100 mt-2">
              View your clinic overview.
            </p>
          </Link>

          <Link
            to="/appointments"
            className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-blue-900">
              My Appointments
            </h3>
            <p className="text-gray-600 mt-2">
              View assigned appointments.
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
              View patient information.
            </p>
          </Link>
        </div>
      </div>
    )
  }

 if (token && user && isAdmin) {
  return (
    <div className="space-y-8">
      <div className="bg-white border rounded-2xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-blue-900">
          Welcome back, {user.name}
        </h1>

        <p className="text-gray-600 mt-2">
          Manage clinic users, doctors, appointments and system data.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/dashboard"
          className="bg-blue-900 text-white rounded-2xl p-6 hover:bg-blue-800 transition"
        >
          <h3 className="text-xl font-semibold">Admin Dashboard</h3>
          <p className="text-blue-100 mt-2">
            View clinic overview and statistics.
          </p>
        </Link>

        <Link
          to="/admin/users"
          className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
        >
          <h3 className="text-xl font-semibold text-blue-900">Users</h3>
          <p className="text-gray-600 mt-2">
            Manage clinic users and roles.
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
            Review and update appointment status.
          </p>
        </Link>

        <Link
          to="/doctors"
          className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
        >
          <h3 className="text-xl font-semibold text-blue-900">Doctors</h3>
          <p className="text-gray-600 mt-2">
            Add and manage doctors.
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
          to="/AdminEmergencyContact"
          className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
        >
          <h3 className="text-xl font-semibold text-blue-900">
            Emergency Contacts
          </h3>
          <p className="text-gray-600 mt-2">
            Add or delete clinic emergency numbers.
          </p>
        </Link>
      </div>
    </div>
  );
}

  if (token && user && isReceptionist) {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-3xl p-10 shadow-lg">
        <p className="text-blue-100 text-sm">Receptionist Home</p>

        <h1 className="text-4xl font-bold mt-2">
          Welcome, {user.name}
        </h1>

        <p className="text-blue-100 mt-3">
          Manage appointments and assist patients with scheduling.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          to="/dashboard"
          className="bg-blue-900 text-white rounded-2xl p-6 hover:bg-blue-800 transition"
        >
          <h3 className="text-xl font-semibold">
            Reception Dashboard
          </h3>

          <p className="text-blue-100 mt-2">
            View daily clinic activity.
          </p>
        </Link>

        <Link
          to="/appointments"
          className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
        >
          <h3 className="text-xl font-semibold text-blue-900">
            Manage Appointments
          </h3>

          <p className="text-gray-600 mt-2">
            Confirm, complete or cancel appointments.
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
            View patient information.
          </p>
        </Link>

        <Link
        to="/AdminEmergencyContact"
        className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
        >
  <h3 className="text-xl font-semibold text-blue-900">
    Emergency Contacts
  </h3>

  <p className="text-gray-600 mt-2">
    Add emergency contacts for patients.
  </p>
</Link>
      </div>
    </div>
  )
}

  if (token && user && isPatient) {
    return (
      <div className="space-y-8">
        <div className="bg-white border rounded-2xl p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-blue-900">
            Welcome back, {user.name}
          </h1>

          <p className="text-gray-600 mt-2">
            Book appointments and follow your clinic activity.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/appointments?mode=book"
            className="bg-blue-900 text-white rounded-2xl p-6 hover:bg-blue-800 transition"
          >
            <h3 className="text-xl font-semibold">Book Appointment</h3>
            <p className="text-blue-100 mt-2">
              Request a new appointment.
            </p>
          </Link>

          <Link
            to="/appointments"
            className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-blue-900">
              My Appointments
            </h3>
            <p className="text-gray-600 mt-2">
              View appointment status.
            </p>
          </Link>

          <Link
            to="/doctors"
            className="bg-white border rounded-2xl p-6 hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-blue-900">Doctors</h3>
            <p className="text-gray-600 mt-2">
              Check available doctors.
            </p>
          </Link>
        </div>
      </div>
    )
  }

return (
  <div className="space-y-16">
    <section className="grid md:grid-cols-2 gap-10 items-center bg-white rounded-3xl overflow-hidden shadow-sm border">
      <div className="p-12">
        <p className="text-blue-700 font-semibold mb-3">
          SmartCare Clinic
        </p>

        <h1 className="text-5xl font-bold text-blue-900 leading-tight">
          Healing starts with smart care
        </h1>

        <p className="text-gray-600 text-lg mt-5 leading-relaxed">
          Book appointments, follow your medical records and connect with
          trusted doctors through one modern clinic management system.
        </p>

        <div className="flex flex-wrap gap-4 mt-8">
          <Link
            to="/login"
            className="bg-blue-900 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Book Appointment
          </Link>

          <a
            href="#about"
            className="border border-blue-900 text-blue-900 px-6 py-3 rounded-xl font-semibold"
          >
            About Us
          </a>

          <a
            href="#contact"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold"
          >
            Contact
          </a>
          <Link
          to="/emergency-contacts"
          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold"
           >
          Emergency Contacts
        </Link>
          
        </div>

        <p className="text-sm text-gray-500 mt-4">
          New patient? Register first to request an appointment.
        </p>
      </div>

   <div className="bg-gradient-to-br from-blue-100 to-blue-50 min-h-[500px]">
  <img
    src={home}
    alt="SmartCare Clinic"
    className="w-full h-full min-h-[500px] object-cover"
  />
</div>
    </section>

    <section id="about" className="bg-white rounded-3xl border p-10 shadow-sm">
      <div className="max-w-5xl mx-auto">
        <p className="text-blue-700 font-semibold mb-3">
          About Us
        </p>

        <h2 className="text-4xl font-bold text-blue-900">
          About SmartCare Clinic
        </h2>

        <p className="text-gray-600 mt-5 leading-relaxed">
          SmartCare Clinic was established to provide accessible, efficient and
          patient-centered healthcare services. Our clinic combines experienced
          medical professionals with modern digital solutions to make healthcare
          easier, safer and more organized for every patient.
        </p>

        <p className="text-gray-600 mt-4 leading-relaxed">
          The clinic is known for professional medical staff, fast appointment
          management, accurate diagnosis, secure medical records and continuous
          care through different medical departments.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {[
            {
              title: 'Cardiology',
              text: 'Diagnosis and treatment of heart and cardiovascular diseases.',
            },
            {
              title: 'Neurology',
              text: 'Care for conditions affecting the brain, spinal cord and nervous system.',
            },
            {
              title: 'Pediatrics',
              text: 'Healthcare services for infants, children and adolescents.',
            },
            {
              title: 'Dermatology',
              text: 'Treatment of skin, hair and nail conditions.',
            },
            {
              title: 'Radiology',
              text: 'Modern diagnostic imaging and medical evaluations.',
            },
            {
              title: 'Emergency Care',
              text: 'Fast support for urgent medical situations and patient needs.',
            },
          ].map((department) => (
            <div
              key={department.title}
              className="border rounded-2xl p-6 hover:shadow-md transition"
            >
              <h3 className="text-xl font-bold text-blue-900">
                {department.title}
              </h3>

              <p className="text-gray-600 mt-3">
                {department.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section
      id="contact"
      className="bg-blue-950 text-white rounded-3xl p-10 grid md:grid-cols-2 gap-8"
    >
      <div>
        <p className="text-blue-200 font-semibold mb-3">
          Contact
        </p>

        <h2 className="text-3xl font-bold">
          Contact SmartCare Clinic
        </h2>

        <p className="text-blue-100 mt-3">
          For appointments, questions or medical support, you can contact our
          reception team through email, phone or visit our clinic location.
        </p>

        <div className="space-y-3 mt-6 text-blue-50">
          <p>
            <strong>Email:</strong> smartcare@example.com
          </p>

          <p>
            <strong>Phone:</strong> +383 44 123 456
          </p>

          <p>
            <strong>Emergency:</strong> +383 49 987 654
          </p>

          <p>
            <strong>Location:</strong> Prishtina, Kosovo
          </p>
        </div>
      </div>

     
    </section>

    <section className="bg-white border rounded-3xl p-10 grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h2 className="text-3xl font-bold text-blue-900">
          Need medical support?
        </h2>

        <p className="text-gray-600 mt-3">
          Create an account and request your appointment online.
          Our team will review and confirm your request.
        </p>
      </div>

      <div className="flex md:justify-end gap-4">
        <Link
          to="/register"
          className="bg-blue-900 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Register
        </Link>

        <Link
          to="/login"
          className="border border-blue-900 text-blue-900 px-6 py-3 rounded-xl font-semibold"
        >
          Login
        </Link>
      </div>
    </section>
  </div>
)
}

export default Home