import React, { useState, useEffect } from 'react';
import './SignUpPage.css';
import { useNavigate, Link } from 'react-router-dom';
import { useFirebaseAuth } from '../../Utils/FirebaseAuthContext';

const SignUpPage = () => {
  const { signUp, user, loading, signInWithGoogle } = useFirebaseAuth();
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      await signUp(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setPending(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className='signUpPage'>
      <div className='authCard'>
        <img src='/logo.png' alt='Lumino Logo' className='authLogo' />
        <h2>Sign Up for Lumino</h2>
        <form onSubmit={handleSubmit} className='authForm'>
          <input name='email' type='email' placeholder='Email' required autoComplete='username' />
          <input name='password' type='password' placeholder='Password' required autoComplete='new-password' />
          <button type='submit' disabled={pending}>{pending ? 'Signing Up...' : 'Sign Up'}</button>
          {error && <div className='error'>{error}</div>}
        </form>
        <div className='divider'><span>or</span></div>
        <button type='button' className='google-btn' onClick={handleGoogleSignUp} disabled={pending}>
          <svg width='20' height='20' viewBox='0 0 48 48' className='google-icon'><g><path fill='#4285F4' d='M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C35.64 2.36 30.13 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.98 6.2C12.13 13.09 17.62 9.5 24 9.5z'/><path fill='#34A853' d='M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.64 7.01l7.19 5.6C43.93 37.36 46.1 31.36 46.1 24.55z'/><path fill='#FBBC05' d='M9.67 28.65c-1.13-3.36-1.13-6.94 0-10.3l-7.98-6.2C-1.13 17.09-1.13 30.91 1.69 37.56l7.98-6.2z'/><path fill='#EA4335' d='M24 46c6.13 0 11.64-2.02 15.81-5.49l-7.19-5.6c-2.01 1.35-4.6 2.14-8.62 2.14-6.38 0-11.87-3.59-14.33-8.94l-7.98 6.2C6.73 42.52 14.82 48 24 48z'/><path fill='none' d='M0 0h48v48H0z'/></g></svg>
          Sign up with Google
        </button>
        <div className='switchLink'>
          Already have an account? <Link to='/sign-in'>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;