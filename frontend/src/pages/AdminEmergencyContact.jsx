import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminEmergencyContact() {
  const [contacts, setContacts] = useState([]);

  const [form, setForm] = useState({
    phone: "",
    department: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await api.get("/emergency-contacts");
      setContacts(res.data.data || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

    const handleChange = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value,
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/emergency-contacts", form);

      setMessage("Emergency contact added successfully.");

      setForm({
        phone: "",
        department: "",
      });

      fetchContacts();
    } catch (error) {
      console.log(error.response?.data || error.message);
      setMessage("Failed to add emergency contact.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/emergency-contacts/${id}`);
      setMessage("Emergency contact deleted successfully.");
      fetchContacts();
    } catch (error) {
      console.log(error.response?.data || error.message);
      setMessage("Failed to delete emergency contact.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h1 className="text-2xl font-bold mb-4">
            Add Emergency Contact
          </h1>

          {message && (
            <p className="mb-4 text-blue-600">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone e.g. +383 44 123 456"
              className="border p-3 rounded"
            />

            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="Department e.g. Emergency"
              className="border p-3 rounded"
            />

            <button className="bg-blue-900 text-white p-3 rounded">
              Add Emergency Contact
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">
            Emergency Contacts
          </h2>

          {contacts.length === 0 ? (
            <p className="text-gray-500">
              No emergency contacts available.
            </p>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="border p-4 rounded mb-3 flex justify-between items-center"
              >
                <div>
                  <p>{contact.phone}</p>
                  {contact.department && (
                    <p className="text-gray-600">
                      {contact.department}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(contact.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}