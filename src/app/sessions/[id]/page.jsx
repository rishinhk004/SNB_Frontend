'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { auth } from '../../utils/firebase';
import { useAuth } from '@/context/AuthContext';

export default function SessionsTable({ params }) {
  const { id } = params;
  const courseId = id;
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // 2. Get the user object from the context

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/sessions/${courseId}`;
        const res = await axios.get(apiUrl);
        setSessions(res.data.msg?.Sessions || []);
      } catch (err) {
        console.error('API Fetch Error:', err);
        toast.error(err.response?.data?.msg || 'Failed to fetch sessions');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchSessions();
    }
  }, [courseId]);

  const cancelSession = async (sessionId) => {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        toast.error('You must be logged in to cancel a session.');
        return;
      }

      const token = await firebaseUser.getIdToken();

      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionId}/cancel`,
        { courseId },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Session cancelled successfully');
      setSessions((currentSessions) =>
        currentSessions.map((session) =>
          session.id === sessionId ? { ...session, isCanceled: true } : session
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to cancel session');
    }
  };
  
  // 3. Determine if the current user is a student
  const isStudent = user?.role === 'Student';

  return (
    <div className="p-6">
      <h2 className="mb-4 text-[24px] font-bold">Class Sessions</h2>

      {loading ? (
        <p>Loading sessions...</p>
      ) : sessions.length === 0 ? (
        <p>No sessions found for this course.</p>
      ) : (
        <table className="min-w-full overflow-hidden border divide-y divide-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-xl font-semibold tracking-wider text-left text-white uppercase">Date</th>
              <th className="px-4 py-3 text-xl font-semibold tracking-wider text-left text-white uppercase">Status</th>
              <th className="px-4 py-3 text-xl font-semibold tracking-wider text-center text-white uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sessions.map((session) => {
              const isPast = dayjs(session.date).isBefore(dayjs(), 'day');
              const status = session.isCanceled
                ? 'Cancelled'
                : isPast
                ? 'Completed'
                : 'Scheduled';

              const statusColor =
                status === 'Completed'
                  ? 'text-green-600 bg-green-50'
                  : status === 'Cancelled'
                  ? 'text-red-600 bg-red-50'
                  : 'text-yellow-600 bg-yellow-50';

              return (
                <tr key={session.id} className="transition hover:bg-gray-50">
                  <td className="px-4 py-3 text-xl text-gray-800 whitespace-nowrap">
                    {dayjs(session.date).format('DD MMM YYYY')}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-xl font-medium rounded ${statusColor}`}>
                    {status}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {status === 'Scheduled' ? (
                      <button
                        className="inline-flex h-auto w-auto px-8 justify-center py-1.5 bg-red-500 text-white text-xl font-medium rounded hover:bg-red-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        onClick={() => cancelSession(session.id)}
                        disabled={isStudent} // 4. Add the disabled attribute
                      >
                        Cancel
                      </button>
                    ) : (
                      <span
                        className={`inline-flex items-center px-4 py-1.5 text-xl font-medium rounded text-white ${
                          status === 'Completed' ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      >
                        {status}
                      </span>
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