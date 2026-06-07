import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function EmergencyContact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await api.get("/emergency-contacts");
      setContacts(res.data.data || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="text-blue-900 font-semibold">
          ← Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow p-8 mt-6">
          <h1 className="text-3xl font-bold text-red-600">
            Emergency Contacts
          </h1>

          <p className="text-gray-600 mt-2">
            In case of emergency, please contact one of the numbers below.
          </p>
        </div>

        {loading ? (
          <p className="mt-6 text-gray-600">Loading contacts...</p>
        ) : contacts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-6 mt-6">
            <p className="text-gray-600">
              No emergency contacts available.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white p-6 rounded-2xl shadow border-l-4 border-red-500"
              >
                <h2 className="text-xl font-bold text-gray-900">
                  {contact.name}
                </h2>

                <p className="text-gray-600 mt-2">
                  Relationship: {contact.relationship}
                </p>

                <p className="text-gray-900 font-semibold mt-2">
                  Phone: {contact.phone}
                </p>

                {contact.email && (
                  <p className="text-gray-600 mt-1">
                    Email: {contact.email}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}