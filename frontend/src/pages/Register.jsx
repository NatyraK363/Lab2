import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await api.post('/register', form)

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))

      navigate('/dashboard')
    } catch (err) {
      setError('Registration failed. Please check your data.')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded border">
      <h2 className="text-2xl font-semibold mb-5">Create account</h2>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          className="border p-2 w-full mb-3"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <input
          className="border p-2 w-full mb-4"
          placeholder="Confirm password"
          type="password"
          value={form.password_confirmation}
          onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
        />

        <button className="bg-blue-900 text-white px-4 py-2 rounded w-full">
          Register
        </button>
      </form>
    </div>
  )
}

export default Register