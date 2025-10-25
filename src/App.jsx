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

    // Validate email if provided
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Validate phone if provided
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
      const res = await fetch(new URL('/api/interest/', API || undefined), {
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
    <div className="page-container">
      {/* Top Section: Logo and Tagline with Plain Background */}
      <section className="header-section">
        <div className="header-content">
          <img src={logo} alt="SeekKrr" className="logo-large" />
          <h1 className="tagline">
            When was the last time you felt like <span className="bold">Columbus?</span>
          </h1>
          <p className="subtitle-text">
            Turn every city into your playground with story-driven quests crafted by locals
          </p>
        </div>
      </section>

      {/* Bottom Section: Background Image with Button */}
      <section className="hero-section" style={{ backgroundImage: `url(${bg})` }}>
        <div className="button-container">
          <button 
            className="cta-button" 
            onClick={() => setOpen(true)}
            disabled={submitted}
          >
            {submitted ? 'Thank you for your Support' : 'Show Interest'}
          </button>
        </div>
      </section>

      <Modal open={open} onClose={() => setOpen(false)}>
        <form className="form" onSubmit={handleSubmit}>
          <h2 id="modal-title">Thank you for your Support</h2>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter Name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className={errors.email ? 'error' : ''}
              disabled={loading}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number (optional)</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter Phone Number"
              className={errors.phone ? 'error' : ''}
              disabled={loading}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <p className="form-disclaimer">
            Be the first customers and get exclusive coupons. Leave your details and we will contact you.
          </p>

          <button className={`submit-button ${loading ? 'loading' : ''}`} type="submit" disabled={loading}>
            {loading ? 'Submitting…' : 'Submit'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
