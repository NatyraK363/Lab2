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

      navigate('/dashboard')
    } catch (err) {
      setError('Invalid email or password.')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded border">
      <h2 className="text-2xl font-semibold mb-5">Login</h2>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-4"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="bg-blue-900 text-white px-4 py-2 rounded w-full">
          Login
        </button>
      </form>
    </div>
  )
}

export default Login