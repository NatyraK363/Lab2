import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Departments from './pages/Departments'

function App() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-blue-900">SmartCare Clinic</h1>
          <p className="text-xs text-gray-500">Clinic Management System</p>
        </div>

        <div className="flex gap-6 text-sm items-center">
          <Link className="text-gray-700 hover:text-blue-900" to="/">Home</Link>

          {token ? (
            <>
              <Link className="text-gray-700 hover:text-blue-900" to="/dashboard">Dashboard</Link>

              <button
                onClick={handleLogout}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="text-gray-700 hover:text-blue-900" to="/login">Login</Link>
              <Link className="text-gray-700 hover:text-blue-900" to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/departments" element={<Departments />} />
        </Routes>
      </main>
    </div>
  )
}

export default App