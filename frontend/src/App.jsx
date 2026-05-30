import { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Departments from './pages/Departments'
import AdminUsers from './pages/AdminUsers'
import Doctors from './pages/Doctors'
import Patient from './pages/Patient'
import MedicalRecord from './pages/MedicalRecord'
import Appointments from './pages/Appointments'
import ChooseRole from './pages/ChooseRole'
import MyPatients from './pages/MyPatients'
import api from './api/axios'
import socket from './socket'

function App() {
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const activeRole = localStorage.getItem('activeRole')

  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [liveNotification, setLiveNotification] = useState(null)

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const fetchNotifications = async () => {
    if (!token) return

    try {
      const res = await api.get('/notifications')
      setNotifications(res.data)
    } catch (err) {
      console.log('Notifications error:', err.response?.data)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [token])

  useEffect(() => {
    socket.on('notification', (data) => {
      setLiveNotification(data)

      setNotifications((prev) => [
        {
          id: Date.now(),
          title: data.title,
          message: data.message,
          type: data.type,
          is_read: false,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ])

      setTimeout(() => {
        setLiveNotification(null)
      }, 6000)
    })

    return () => {
      socket.off('notification')
    }
  }, [])

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`)

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      )
    } catch (err) {
      console.log('Mark notification error:', err.response?.data)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('activeRole')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {liveNotification && (
        <div className="fixed top-5 right-5 bg-blue-900 text-white px-6 py-4 rounded-xl shadow-xl z-50">
          <h3 className="font-semibold">
            {liveNotification.title}
          </h3>

          <p className="text-sm mt-1">
            {liveNotification.message}
          </p>
        </div>
      )}

      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-blue-900">
            SmartCare Clinic
          </h1>

          <p className="text-xs text-gray-500">
            Clinic Management System
          </p>
        </div>

        <div className="flex gap-6 text-sm items-center">
          {token ? (
            <>
              <Link className="text-gray-700 hover:text-blue-900" to="/">
                Home
              </Link>

              <Link className="text-gray-700 hover:text-blue-900" to="/dashboard">
                Dashboard
              </Link>

              {(activeRole === 'patient' || activeRole === 'doctor') && (
  <div className="relative">
    <button
      onClick={() => setShowNotifications(!showNotifications)}
      className="relative text-xl"
    >
      📩

      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-white border rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-blue-900">
                        Notifications
                      </h3>
                    </div>

                    {notifications.length === 0 ? (
                      <p className="p-4 text-gray-500 text-sm">
                        No notifications yet.
                      </p>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b text-sm ${
                            notification.is_read ? 'bg-white' : 'bg-blue-50'
                          }`}
                        >
                          <p className="font-semibold text-blue-900">
                            {notification.title}
                          </p>

                          <p className="text-gray-600 mt-1">
                            {notification.message}
                          </p>

                          {!notification.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-blue-700 text-xs mt-2"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              )}
              <button
                onClick={handleLogout}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="text-gray-700 hover:text-blue-900" to="/">
                Home
              </Link>

              <Link className="text-gray-700 hover:text-blue-900" to="/login">
                Login
              </Link>

              <Link className="text-gray-700 hover:text-blue-900" to="/register">
                Register
              </Link>
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
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/medical-records" element={<MedicalRecord />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/doctors" element={<Doctors />} />

          <Route
            path="/patients"
            element={
              activeRole === 'doctor'
                ? <MyPatients />
                : <Patient />
            }
          />

          <Route path="/choose-role" element={<ChooseRole />} />
        </Routes>
      </main>
    </div>
  )
}

export default App