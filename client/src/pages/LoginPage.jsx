import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, setStoredToken } from '../lib/api.js';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      setStoredToken(response.token);
      navigate('/');
    } catch (submitError) {
      setError(submitError.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page login-card">
      <h1>Login</h1>
      <form className="entry-form panel" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="name@example.com"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="password"
            required
          />
        </label>
        {error ? <p role="alert">{error}</p> : null}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </section>
  );
}
