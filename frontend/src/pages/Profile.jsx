import { useEffect, useState } from 'react'
import api from '../api/axios'

function Profile() {
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)
  const [success, setSuccess] = useState('')

  const fetchProfile = async () => {
    const res = await api.get('/profile')
    setProfile(res.data)
    setName(res.data.user?.name || '')
    setPreview(res.data.photo)
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]

    if (!file) return

    setPhoto(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSave = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', name)

    if (photo) {
      formData.append('photo', photo)
    }

    await api.post('/profile/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    setSuccess('Profile updated successfully.')
    setEditing(false)
    setPhoto(null)
    fetchProfile()
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white border rounded-2xl p-8 shadow-sm text-center">
        <img
          src={
            preview ||
            'https://ui-avatars.com/api/?name=' + profile?.user?.name
          }
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover mx-auto border"
        />

        {!editing ? (
          <>
            <h1 className="text-3xl font-bold text-blue-900 mt-4">
              {profile?.user?.name}
            </h1>

            <p className="text-gray-600 mt-1">
              {profile?.user?.email}
            </p>

            {success && (
              <p className="text-green-700 mt-4">
                {success}
              </p>
            )}

            <button
              onClick={() => setEditing(true)}
              className="mt-6 bg-blue-900 text-white px-6 py-3 rounded-lg"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleSave} className="mt-6 space-y-4">
            <input
              className="border p-3 rounded-lg w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="border p-3 rounded-lg w-full"
            />

            <div className="flex gap-3 justify-center">
              <button className="bg-blue-900 text-white px-6 py-3 rounded-lg">
                Save Changes
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditing(false)
                  setName(profile?.user?.name || '')
                  setPreview(profile?.photo)
                  setPhoto(null)
                }}
                className="border px-6 py-3 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Profile