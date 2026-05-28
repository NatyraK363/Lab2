import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Login() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await api.post('/login', form)

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))

      // clear old role
      localStorage.removeItem('activeRole')

      // multiple roles
      if (res.data.user.roles.length > 1) {
        navigate('/choose-role')
      } else {
        // single role
        localStorage.setItem(
          'activeRole',
          res.data.user.roles[0].name
        )

        navigate('/Home')
      }

    } catch (err) {
      setError('Invalid email or password.')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl border shadow-sm">
      <h2 className="text-3xl font-bold text-blue-900 mb-2">
        Login
      </h2>

      <p className="text-gray-600 mb-6">
        Welcome back to SmartCare Clinic.
      </p>

      {error && (
        <p className="text-red-600 text-sm mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="border p-3 rounded-lg w-full"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          className="border p-3 rounded-lg w-full"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-3 rounded-lg w-full transition">
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
