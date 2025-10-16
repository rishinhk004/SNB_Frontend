'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext.jsx';
import apiClient from '../utils/apiClient.js';
import { X } from 'lucide-react';
import { DialogClose } from '../../components/ui/dialog.jsx';
import styles from './courses.module.scss';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Calendar } from '../../components/ui/calendar.jsx';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'sonner';

const AnnouncementModal = ({ onClose, courseId, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error('Title and content are required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('courseId', courseId);
      formData.append('title', title);
      formData.append('content', content);
      if (attachment) formData.append('attachment', attachment);

      await apiClient.post('/announcements', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Announcement created!');
      onSave(); // Refresh announcements
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Create Announcement</h2>
        <form onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Content</label>
            <textarea
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>
          <div className={styles.formGroup}>
            <label>Attachment (optional)</label>
            <input type="file" onChange={(e) => setAttachment(e.target.files[0])} />
          </div>
          <button type="submit" className={styles.saveButton} disabled={loading}>
            {loading ? 'Creating...' : 'Create Announcement'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Component to show announcements (for both professors and students)
const AnnouncementsList = ({ courseId }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/announcements/course/${courseId}`);
      setAnnouncements(res.data.msg || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  if (loading) return <p>Loading announcements...</p>;
  if (announcements.length === 0) return <p>No announcements yet.</p>;

  return (
    <div className={styles.announcementList}>
      {announcements.map((ann) => (
        <div key={ann.id} className={styles.announcementCard}>
          <h4>{ann.title}</h4>
          <p>{ann.content}</p>
          {ann.attachment && (
            <a href={ann.attachment} target="_blank" rel="noopener noreferrer">
              View Attachment
            </a>
          )}
          <small>Posted on: {new Date(ann.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

const AddCourseModal = ({ onClose, onSave, professorId }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [credits, setCredits] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !code) {
      alert('Course Name and Code are required.');
      return;
    }
    try {
      const courseData = {
        name,
        code,
        description,
        professorId,
        credits: credits ? parseInt(credits, 10) : null,
        semester: semester ? parseInt(semester, 10) : null,
        year: year ? parseInt(year, 10) : null,
      };
      await onSave(courseData);
      onClose();
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Create a New Course</h2>
        <form onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Course Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="code">Course Code</label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="credits">Credits</label>
              <input
                id="credits"
                type="number"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="semester">Semester</label>
              <input
                id="semester"
                type="number"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="year">Year</label>
              <input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            ></textarea>
          </div>
          <button type="submit" className={styles.saveButton}>
            Save Course
          </button>
        </form>
      </div>
    </div>
  );
};

const TimetableModal = ({ onClose, onSave }) => {
  const DAYS_OF_WEEK = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const [day, setDay] = useState('Monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');

  const handleSave = (e) => {
    e.preventDefault();
    if (day && startTime && endTime) {
      onSave({ dayOfWeek: day, startTime, endTime });
      onClose();
    } else {
      alert('Please fill out all fields.');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Create a New Timetable Slot</h2>
        <form onSubmit={handleSave}>
          <div className={styles.formGroup}>
            <label htmlFor="day">Day of the Week</label>
            <select
              id="day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            >
              {DAYS_OF_WEEK.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="startTime">Start Time</label>
            <input
              type="time"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="endTime">End Time</label>
            <input
              type="time"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.saveButton}>
            Save Session Details
          </button>
        </form>
      </div>
    </div>
  );
};

const getNextDateForDay = (dayOfWeek, fromDate = new Date()) => {
  const dayIndex = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ].indexOf(dayOfWeek);
  const resultDate = new Date(fromDate.getTime());
  resultDate.setDate(
    fromDate.getDate() + ((dayIndex + 7 - fromDate.getDay()) % 7)
  );
  // If the day is today but we want the "next" one, add a week
  if (resultDate.getTime() <= fromDate.getTime()) {
    resultDate.setDate(resultDate.getDate() + 7);
  }
  return resultDate;
};

const ProfessorLayout = ({ user }) => {
  const [myCourses, setMyCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const router = useRouter();

  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);
  const [timetable, setTimetable] = useState([]);

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const [openAllModal, setOpenAllModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcementKey, setAnnouncementKey] = useState(0);

  const fetchMyCourses = useCallback(
    async (selectCourseId = null) => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/courses');
        const allCourses = response.data.msg || [];
        const professorCourses = allCourses.filter(
          (c) => c.professorId === user.id
        );
        setMyCourses(professorCourses);

        if (selectCourseId) {
          const updatedCourse = professorCourses.find(
            (c) => c.id === selectCourseId
          );
          setSelectedCourse(updatedCourse);
        }
      } catch (error) {
        console.error("Error loading professor's courses:", error);
        alert(error.response?.data?.message || 'Could not load your courses.');
      } finally {
        setIsLoading(false);
      }
    },
    [user.id]
  );

  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  useEffect(() => {
    if (selectedCourse) {
      setTimetable(selectedCourse.timetable || []);
    }
  }, [selectedCourse]);

  const handleAddCourse = async (courseData) => {
    await apiClient.post('/courses', courseData);
    fetchMyCourses();
  };

  const handleDeleteCourse = async (courseId) => {
    if (
      window.confirm('Are you sure you want to permanently delete this course?')
    ) {
      try {
        await apiClient.delete(`/courses/${courseId}`);
        if (selectedCourse?.id === courseId) setSelectedCourse(null);
        fetchMyCourses();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete course');
      }
    }
  };

  const handleSaveTimetable = async (timetableData) => {
    if (!selectedCourse) return;
    try {
      await apiClient.post('/timetables', {
        ...timetableData,
        courseId: selectedCourse.id,
      });
      fetchMyCourses(selectedCourse.id);
    } catch (error) {
      alert(
        `Error saving timetable: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleDeleteTimetable = async (id) => {
    if (!selectedCourse) return;
    try {
      console.log(id);
      await apiClient.delete(`/timetables/`, {
        data: {
          timetableId: id,
        },
      });
      fetchMyCourses(selectedCourse.id);
    } catch (error) {
      alert(
        `Error deleting timetable: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleGenerateOneSession = async () => {
    if (!selectedCourse || timetable.length === 0 || !date) {
      alert('Please select a course, add timetable slots, and pick a date.');
      return;
    }

    setLoading(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');

      const promises = timetable.map((slot) =>
        apiClient.post('sessions/generateOne', {
          courseId: selectedCourse.id,
          date: formattedDate,
        })
      );

      await Promise.all(promises);
      alert(
        `Successfully generated ${timetable.length} session(s) for ${formattedDate}.`
      );
      setOpen(false);
      setDate(undefined);
    } catch (error) {
      alert(
        `Error generating sessions: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAllSessions = async () => {
    if (!selectedCourse || timetable.length === 0) {
      alert(
        'Please select a course and add at least one timetable slot first.'
      );
      return;
    }

    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    if (startDate > endDate) {
      alert('Start date cannot be after end date.');
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to generate sessions for ${selectedCourse.name} from ${startDate.toDateString()} to ${endDate.toDateString()}?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await apiClient.post('/sessions', {
        courseId: selectedCourse.id,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      });

      alert('Sessions generated successfully for the selected date range.');
      setOpenAllModal(false); // Close the popup
      setStartDate(undefined); // Optionally reset fields
      setEndDate(undefined);
    } catch (error) {
      alert(
        `Error generating sessions: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {isAddCourseModalOpen && (
        <AddCourseModal
          onClose={() => setIsAddCourseModalOpen(false)}
          onSave={handleAddCourse}
          professorId={user.id}
        />
      )}
      {isTimetableModalOpen && (
        <TimetableModal
          onClose={() => setIsTimetableModalOpen(false)}
          onSave={handleSaveTimetable}
        />
      )}
      {isAnnouncementModalOpen && selectedCourse && (
        <AnnouncementModal
          onClose={() => setIsAnnouncementModalOpen(false)}
          courseId={selectedCourse.id}
          onSave={() => {
            setAnnouncementKey((prevKey) => prevKey + 1);
          }}
        />
      )}

      <aside className={styles.sidebar}>
        <h2>My Courses</h2>
        <button
          className={styles.addCourseButton}
          onClick={() => setIsAddCourseModalOpen(true)}
        >
          + Add New Course
        </button>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {myCourses.map((course) => (
              <li
                key={course.id}
                className={
                  selectedCourse?.id === course.id ? styles.active : ''
                }
                onClick={() => setSelectedCourse(course)}
              >
                {course.name}
              </li>
            ))}
          </ul>
        )}
      </aside>
      <main className={styles.mainContent}>
        {!selectedCourse ? (
          <div className={styles.placeholder}>
            <h2>Professor Dashboard</h2>
            <p>
              Select a course from the left to see its details or add a new one.
            </p>
          </div>
        ) : (
          <div>
            <h1>
              <strong>COURSE:</strong> {selectedCourse.name}
            </h1>
            <div className={styles.courseDetailsGrid}>
              <p>
                <strong>Description:</strong>{' '}
                {selectedCourse.description || 'No description available.'}
              </p>
              <p>
                <strong>Course Code:</strong> {selectedCourse.code || 'N/A'}
              </p>
              <p>
                <strong>Credits:</strong> {selectedCourse.credits ?? 'N/A'}
              </p>
              <p>
                <strong>Semester:</strong> {selectedCourse.semester ?? 'N/A'}
              </p>
              <p>
                <strong>Year:</strong> {selectedCourse.year ?? 'N/A'}
              </p>
            </div>
            <div className={styles.actions}>
              <button
                onClick={() => router.push(`/discussion/${selectedCourse.id}`)}
              >
                View Discussions
              </button>
              <button
                onClick={() => router.push(`/sessions/${selectedCourse.id}`)}
                style={{ marginLeft: '-875px' }} // Reduced margin
              >
                View All Sessions
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteCourse(selectedCourse.id)}
              >
                Delete Course
              </button>
            </div>

            <hr className={styles.divider} />

            <h2>Timetable & Sessions</h2>
            <p>
              Set a recurring weekly schedule for this course. Once set, you can
              generate the actual class sessions.
            </p>
            <div className={styles.actions}>
              <button
                className={styles.timetable}
                onClick={() => setIsTimetableModalOpen(true)}
              >
                Add to Timetable
              </button>
              <div className={styles.generate}>
                <button
                  className={styles.generateOne}
                  onClick={() => setOpen(true)}
                  disabled={!timetable.length}
                >
                  Generate One Session
                </button>
                <Dialog
                  open={open}
                  onOpenChange={setOpen}
                  className="bg-transparent"
                >
                  <DialogContent className="flex flex-col gap-10 overflow-hidden">
                    <DialogClose asChild>
                      <button
                        className="absolute transition-opacity rounded-sm right-4 top-4 opacity-70 ring-offset-background hover:opacity-100 focus:outline-none"
                        aria-label="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </DialogClose>

                    <DialogHeader>
                      <DialogTitle>Select a Date for the Session</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col items-center w-full px-4 py-6 mt-3">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="scale-110 border rounded-md shadow-sm"
                        captionLayout="dropdown"
                      />

                      <Button
                        onClick={handleGenerateOneSession}
                        disabled={!date || loading}
                        className={`w-full rounded-md px-4 py-2 text-white font-semibold transition ${
                          !date || loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-black hover:bg-gray-900'
                        }`}
                      >
                        {loading ? 'Generating...' : 'Generate Session'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <button
                  className={styles.generateAll}
                  onClick={() => setOpenAllModal(true)}
                  disabled={!timetable.length}
                >
                  Generate All Sessions
                </button>
                <Dialog open={openAllModal} onOpenChange={setOpenAllModal}>
                  <DialogContent className="w-[90vw] max-w-lg p-0 overflow-hidden">
                    <DialogHeader className="px-6 pt-6">
                      <DialogTitle className="text-lg font-semibold text-center">
                        Select Start and End Dates
                      </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col items-center gap-6 px-6 py-6">
                      <div className="flex flex-col justify-between w-full gap-6">
                        <div className="flex flex-col items-center">
                          <p className="mb-2 font-medium">Start Date</p>
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            className="border rounded-md shadow-md"
                          />
                        </div>

                        <div className="flex flex-col items-center">
                          <p className="mb-2 font-medium">End Date</p>
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            className="border rounded-md shadow-md"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={async () => {
                          await handleGenerateAllSessions();
                          setOpenAllModal(false);
                        }}
                        disabled={
                          !startDate || !endDate || timetable.length === 0
                        }
                        className="w-full py-2 font-semibold text-white bg-black rounded-md hover:bg-gray-900"
                      >
                        Generate All Sessions
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {timetable.length > 0 && (
              <div className={styles.tableContainer}>
                <h3>Scheduled Timetable</h3>
                <table className={styles.timetable}>
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timetable.map((slot) => (
                      <tr key={slot.id}>
                        <td>{slot.dayOfWeek}</td>
                        <td>{slot.startTime}</td>
                        <td>{slot.endTime}</td>
                        <td>
                          <button
                            className={styles.deleteButtonSmall}
                            onClick={() => handleDeleteTimetable(slot.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <hr className={styles.divider} />
            <h2>Announcements</h2>
            <div className={styles.actions}>
              <button onClick={() => setIsAnnouncementModalOpen(true)}>
                Create New Announcement
              </button>
            </div>
            <AnnouncementsList
              key={announcementKey}
              courseId={selectedCourse.id}
            />
          </div>
        )}
      </main>
    </div>
  );
};

const StudentLayout = ({ user }) => {
  const [view, setView] = useState('available');
  const [allCourses, setAllCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingAnnouncementsFor, setViewingAnnouncementsFor] = useState(null);

  const router = useRouter();

  const fetchAllCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/courses');
      setAllCourses(response.data.msg || []);
    } catch (error) {
      console.error('Error fetching all courses:', error);
      alert(error.response?.data?.message || 'Could not load courses.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMyCourses = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`
      );
      setMyCourses(res.data.msg.courses || []);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchAllCourses();
    fetchMyCourses();
  }, [fetchAllCourses, fetchMyCourses]);

  const handleEnroll = async (courseId) => {
    try {
      await apiClient.post('/enrollments', { courseId, userId: user.id });
      toast.success('Enrolled successfully in the course!');
      await fetchMyCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to enroll');
    }
  };

  const enrolledCourseIds = myCourses.map((c) => c.course?.id || c.id);
  const availableCourses = allCourses.filter(
    (course) => !enrolledCourseIds.includes(course.id)
  );
  const enrolledCourses = allCourses.filter((course) =>
    enrolledCourseIds.includes(course.id)
  );

  const coursesToDisplay =
    view === 'available' ? availableCourses : enrolledCourses;

  return (
    <div className={styles.pageContainer}>
      <Dialog
        open={!!viewingAnnouncementsFor}
        onOpenChange={(isOpen) => !isOpen && setViewingAnnouncementsFor(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Announcements</DialogTitle>
          </DialogHeader>
          {viewingAnnouncementsFor && (
            <AnnouncementsList courseId={viewingAnnouncementsFor} />
          )}
        </DialogContent>
      </Dialog>
      <aside className={styles.sidebar}>
        <h2>Navigation</h2>
        <ul>
          <li
            className={view === 'available' ? styles.active : ''}
            onClick={() => setView('available')}
          >
            Available Courses
          </li>
          <li
            className={view === 'enrolled' ? styles.active : ''}
            onClick={() => setView('enrolled')}
          >
            My Courses
          </li>
        </ul>
      </aside>

      <main className={styles.mainContent}>
        <h1>
          {view === 'available' ? 'Available Courses' : 'My Enrolled Courses'}
        </h1>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className={styles.courseList}>
            {coursesToDisplay.length > 0 ? (
              coursesToDisplay.map((course) => (
                <div key={course.id} className={styles.courseCard}>
                  <div className={styles.courseInfo}>
                    <h3>{course.name}</h3>
                    <p>
                      {course.code} - Taught by{' '}
                      {course.professor?.name || 'N/A'}
                    </p>
                  </div>

                  <div className={styles.courseActions}>
                    {view === 'available' ? (
                      <>
                        <button
                          className={styles.buttonSuccess}
                          onClick={() => handleEnroll(course.id)}
                        >
                          Enroll
                        </button>
                        <button
                          className={styles.buttonDark}
                          onClick={() => router.push(`/sessions/${course.id}`)}
                          style={{ marginLeft: '8px' }}
                        >
                          View All Sessions
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-row">
                        <button
                          className={styles.buttonDark}
                          onClick={() => setViewingAnnouncementsFor(course.id)}
                        >
                          Announcements
                        </button>
                        <button
                          className={styles.buttonDark}
                          onClick={() =>
                            router.push(`/discussion/${course.id}`)
                          }
                          style={{ marginLeft: '8px' }}
                        >
                          Discussion
                        </button>
                        <button
                          className={styles.buttonDark}
                          onClick={() => router.push(`/sessions/${course.id}`)}
                          style={{ marginLeft: '8px' }}
                        >
                          View All Sessions
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.placeholder}>
                No courses to display in this section.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default function CoursesPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  if (!token) {
    return <div className={styles.pageLoader}>Loading Dashboard...</div>;
  }

  if (!user) {
    router.push('/login');
    return <div className={styles.pageLoader}>Redirecting to login...</div>;
  }

  return user.role === 'Professor' ? (
    <ProfessorLayout user={user} />
  ) : (
    <StudentLayout user={user} />
  );
}