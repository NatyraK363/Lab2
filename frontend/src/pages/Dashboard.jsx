import { useEffect, useState } from 'react'
import api from '../api/axios'

function Dashboard() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    api.get('/me')
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

      <div className="bg-white p-5 rounded border">
        {user ? (
          <>
            <p className="font-medium">Welcome, {user.name}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
          </>
        ) : (
          <p className="text-gray-600">No user logged in.</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard