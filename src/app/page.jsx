'use client';

import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import style from './home.module.scss';

// --- Import your hero image ---
import heroImage from '../assets/hero.png';

// --- Import Icons ---
import {
  FaCrosshairs,
  FaHeart,
  FaLightbulb,
  FaCalendarAlt,
  FaComments,
  FaUsers,
  FaVideo,
  FaShareAlt,
  FaBook,
} from 'react-icons/fa';

const Home = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Check login status (e.g., token stored in localStorage or context)
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleNavigate = (path) => {
    router.push(path);
  };

  return (
    <div className={style.pageWrapper}>
      {/* ========== Top Navigation Bar ========== */}
      {isLoggedIn && (
        <div className={style.topNav}>
          <div className={style.logoSpace}></div>
          <div
            className={style.profileIcon}
            onClick={() => handleNavigate('/profile')}
          >
            <FaUserCircle size={30} />
          </div>
        </div>
      )}

      {/* ========== Hero Section ========== */}
      <header className={style.hero}>
        <div className={style.heroContent}>
          <h1 className={style.heroTitle}>ClassCompass</h1>
          <p className={style.heroSubtitle}>
            Revolutionize education with seamless class management, interactive
            discussions, and collaborative learning experiences for professors
            and students.
          </p>

          {/* --- Hero Image --- */}
          <div className={style.heroImageContainer}>
            <Image
              src={heroImage}
              alt="A preview of the ClassCompass platform"
              priority
              style={{ width: '100%', height: 'auto' }}
            />
          </div>

          {/* ✅ Conditional Buttons */}
          <div className={style.heroButtons}>
            {isLoggedIn ? (
              <button
                className={style.primaryButton}
                onClick={() => handleNavigate('/course')}
              >
                Go to Courses
              </button>
            ) : (
              <>
                <button
                  className={style.primaryButton}
                  onClick={() => handleNavigate('/signup')}
                >
                  Sign Up
                </button>
                <button
                  className={style.secondaryButton}
                  onClick={() => handleNavigate('/login')}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ========== About/Mission Section ========== */}
      <main>
        <section className={style.aboutSection}>
          <div className={style.missionContent}>
            <h2>About Us</h2>
            <p>
              ClassCompass was born from the vision of creating a seamless
              educational experience that adapts to the needs of modern learning
              environments. We believe that technology should enhance, not
              complicate, the teaching and learning process.
              <br />
              <br />
              Our platform bridges the gap between traditional classroom
              management and digital innovation, providing educators with the
              tools they need to create engaging, interactive, and effective
              learning experiences.
            </p>
          </div>

          <div className={style.valuesContent}>
            <div className={style.valueCard}>
              <FaCrosshairs className={style.valueIcon} />
              <div>
                <h3>Our Vision</h3>
                <p>
                  To empower educators worldwide with intuitive tools that make
                  teaching more effective and learning more engaging.
                </p>
              </div>
            </div>

            <div className={style.valueCard}>
              <FaHeart className={style.valueIcon} />
              <div>
                <h3>Our Values</h3>
                <p>
                  We prioritize user experience, accessibility, and continuous
                  innovation to serve the educational community.
                </p>
              </div>
            </div>

            <div className={style.valueCard}>
              <FaLightbulb className={style.valueIcon} />
              <div>
                <h3>Innovation</h3>
                <p>
                  We constantly evolve our platform based on educator feedback
                  and emerging educational trends.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========== Features Section ========== */}
        <section className={style.featuresSection}>
          <h2 className={style.sectionTitle}>
            Powerful Features for Modern Education
          </h2>
          <p className={style.sectionSubtitle}>
            Everything you need to create engaging learning experiences and
            manage your educational content effectively.
          </p>

          <div className={style.featuresGrid}>
            <div className={style.featureCard}>
              <FaCalendarAlt className={style.featureIcon} />
              <h3>Class Scheduling</h3>
              <p>
                Effortlessly schedule and manage classes, sessions, and courses
                with our intuitive calendar system.
              </p>
            </div>

            <div className={style.featureCard}>
              <FaComments className={style.featureIcon} />
              <h3>Interactive Discussions</h3>
              <p>
                Foster engagement with threaded discussions, Q&A sessions, and
                real-time collaboration tools.
              </p>
            </div>

            <div className={style.featureCard}>
              <FaUsers className={style.featureIcon} />
              <h3>Student Management</h3>
              <p>
                Track attendance, monitor progress, and manage student
                enrollment across all your courses.
              </p>
            </div>

            <div className={style.featureCard}>
              <FaVideo className={style.featureIcon} />
              <h3>Timetable Management</h3>
              <p>
                Organize weekly class schedules with a centralized view of all
                courses, sessions, and instructor availability.
              </p>
            </div>

            <div className={style.featureCard}>
              <FaShareAlt className={style.featureIcon} />
              <h3>Resource Sharing</h3>
              <p>
                Share course materials, assignments, and resources with easy
                file management and organization.
              </p>
            </div>

            <div className={style.featureCard}>
              <FaBook className={style.featureIcon} />
              <h3>Course Builder</h3>
              <p>
                Create comprehensive course structures with modules, lessons,
                and assessment tools.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ========== Footer ========== */}
      <footer className={style.footer}>
        <p>
          &copy; {new Date().getFullYear()} ClassCompass. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
