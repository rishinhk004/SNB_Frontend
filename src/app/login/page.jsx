'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useAuth } from '@/context/AuthContext';
import style from './login.module.scss';
import axios from 'axios';

const LoginPage = () => {
  const router = useRouter();
  const { user, setUser, setToken } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');


  useEffect(() => {
    if (user) {
      router.replace('/profile');
    }
  }, [user, router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setMessage('All fields are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@([a-z]+\.)?nits\.ac\.in$/i;
    if (!emailRegex.test(email)) {
      setMessage(
        'Please use your official college email ending in @nits.ac.in or @<dept>.nits.ac.in'
      );
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      const firebaseUser = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await firebaseUser.user.getIdToken();

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signIn`,
        { token }
      );

      setUser(res.data.msg.user);
      setToken(token);
      router.push('/profile');
    } catch (err) {
      const msg = err?.response?.data?.msg || err?.message || 'Login failed';
      setMessage(msg);
    }
  };

  return (
    <main className={style.parent}>
      <div className={style.container}>
        <h1 className={style.h1}>Login</h1>
        <form className={style.smallForm} onSubmit={handleLogin}>
          {message && <div className={style.message}>{message}</div>}

          <label className={style.label}>Username *</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. Sam"
            className={style.input}
          />

          <label className={style.label}>Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={style.input}
            placeholder="e.g. samarjitroy025@gmail.com"
          />

          <label className={style.label}>Password *</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={style.input}
          />

          <button type="submit" className={style.button}>
            <strong>Login</strong>
          </button>
        </form>

        <div className={style.signupMsg}>
          Don&apos;t have an account? <Link href="/signup">Sign up</Link>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
