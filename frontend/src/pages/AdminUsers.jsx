import { useEffect, useState } from 'react'
import api from '../api/axios'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [sortOrder, setSortOrder] = useState('az')

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role_id: '',
  })

  const fetchUsers = async () => {
    const res = await api.get('/admin/users')
    setUsers(res.data)
  }

  const fetchRoles = async () => {
    const res = await api.get('/roles')
    setRoles(res.data)
  }

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    await api.post('/admin/users', form)

    setForm({
      name: '',
      email: '',
      password: '',
      role_id: '',
    })

    fetchUsers()
  }

  const handleDelete = async (id) => {
    await api.delete(`/admin/users/${id}`)
    fetchUsers()
  }

  const filteredUsers = users
    .filter((user) => {
      const name = user.name?.toLowerCase() || ''
      const email = user.email?.toLowerCase() || ''
      const searchText = search.toLowerCase()

      const matchesSearch =
        name.includes(searchText) ||
        email.includes(searchText)

      const matchesRole = roleFilter
        ? user.roles?.some((role) => String(role.id) === roleFilter)
        : true

      return matchesSearch && matchesRole
    })
    .sort((a, b) => {
      const nameA = a.name || ''
      const nameB = b.name || ''

      return sortOrder === 'az'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA)
    })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-blue-900">Users Management</h1>
        <p className="text-gray-600 mt-2">
          Create users and assign roles.
        </p>
      </div>

      <div className="bg-white border rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-5">Add New User</h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <input
            className="border p-3 rounded-lg"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="border p-3 rounded-lg"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="border p-3 rounded-lg"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <select
            className="border p-3 rounded-lg"
            value={form.role_id}
            onChange={(e) => setForm({ ...form, role_id: e.target.value })}
          >
            <option value="">Select role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>

          <button className="bg-blue-900 text-white px-6 py-3 rounded-lg md:col-span-2">
            Save User
          </button>
        </form>
      </div>

      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">
          Search & Filter Users
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <input
            className="border p-3 rounded-lg"
            placeholder="Search name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border p-3 rounded-lg"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
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
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden">
        {filteredUsers.length === 0 ? (
          <p className="p-5 text-gray-500">No users found.</p>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="p-5 border-b flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-blue-900">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>

                <div className="flex gap-2 mt-2">
                  {user.roles.map((role) => (
                    <span
                      key={role.id}
                      className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {role.name}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleDelete(user.id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminUsers