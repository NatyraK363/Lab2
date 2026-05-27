import { useNavigate } from 'react-router-dom'

function ChooseRole() {
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'))

  const handleChooseRole = (roleName) => {
    localStorage.setItem('activeRole', roleName)

    navigate('/dashboard')
  }

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white border rounded-2xl p-8 w-full max-w-lg shadow-sm">
        
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          Choose Role
        </h1>

        <p className="text-gray-600 mb-6">
          Select how you want to continue in SmartCare Clinic.
        </p>

        <div className="space-y-4">
          {user.roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleChooseRole(role.name)}
              className="w-full border rounded-xl p-5 text-left hover:bg-blue-50 transition"
            >
              <h2 className="text-xl font-semibold text-blue-900 capitalize">
                Continue as {role.name}
              </h2>

              <p className="text-gray-500 mt-1">
                Access the system with {role.name} permissions.
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChooseRole