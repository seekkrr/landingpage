import React, { useState } from 'react';
import bg from './assets/background.jpg';
import logo from './assets/seekkrr-logo.svg';
import Modal from './Modal.jsx';

const API = import.meta.env.VITE_API_BASE_URL || '';

export default function App() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (form.phone && !/^[\d\s+()-]{10,}$/.test(form.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/interest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitted(true);
        setOpen(false);
        setForm({ name: '', email: '', phone: '' });
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (err) {
      alert('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ backgroundImage: `url(${bg})` }}>
      <header className="header">
        <img src={logo} alt="SeekKrr" className="logo" />
      </header>

      <main className="hero">
        <h1 className="title">
          When was the last time you felt like <span className="bold">Columbus?</span>
        </h1>
        
        <p className="subtitle">
          Turn every city into your playground with story-driven quests crafted by locals
        </p>

        {!submitted ? (
          <button className="cta" onClick={() => setOpen(true)}>
            Show Interest
          </button>
        ) : (
          <div className="thankyou">
            Thank you for your Support
          </div>
        )}
      </main>

      <Modal open={open} onClose={() => setOpen(false)}>
        <form className="form" onSubmit={handleSubmit}>
          <h2>Thank you for your Support</h2>
          
          <label>
            Name (optional)
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              disabled={loading}
            />
          </label>

          <label>
            Email (optional)
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={errors.email ? 'error' : ''}
              disabled={loading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </label>

          <label>
            Phone (optional)
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className={errors.phone ? 'error' : ''}
              disabled={loading}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </label>

          <button className={`cta ${loading ? 'loading' : ''}`} type="submit" disabled={loading}>
            {loading ? 'Submitting…' : 'Submit'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
