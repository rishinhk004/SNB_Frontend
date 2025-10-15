'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { auth } from './firebase.js';

export default function SessionsTable({ courseId }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_API}/sessions/${courseId}`
      );
      setSessions(res.data.msg);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const cancelSession = async (sessionId) => {
    try {
      const token = user ? await user.getIdToken() : '';
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_API}/sessions/${sessionId}/cancel`,
        { courseId },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Session cancelled successfully');
      fetchSessions();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to cancel session');
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-bold">Class Sessions</h2>

      {loading ? (
        <p>Loading sessions...</p>
      ) : (
        <table className="w-full border border-collapse border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => {
              const isPast = dayjs(session.date).isBefore(dayjs(), 'day');
              const status = session.isCanceled
                ? 'Cancelled'
                : isPast
                  ? 'Completed'
                  : 'Scheduled';

              return (
                <tr key={session.id}>
                  <td className="p-2 border">
                    {dayjs(session.date).format('DD MMM YYYY')}
                  </td>
                  <td
                    className={`border p-2 font-semibold ${
                      status === 'Completed'
                        ? 'text-green-600'
                        : status === 'Cancelled'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                    }`}
                  >
                    {status}
                  </td>
                  <td className="p-2 text-center border">
                    {status === 'Scheduled' ? (
                      <button
                        className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                        onClick={() => cancelSession(session.id)}
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        className={`px-3 py-1 rounded text-white ${
                          status === 'Completed'
                            ? 'bg-green-500'
                            : 'bg-gray-400'
                        }`}
                        disabled
                      >
                        {status}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
