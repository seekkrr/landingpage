import React, { useState } from 'react'
import bg from './assets/background.jpg'
import logo from './assets/SeekKrr logo.svg'
import Modal from './Modal.jsx'
const API = import.meta.env.VITE_API_BASE_URL || '';


export default function App() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/interest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setSubmitted(true)
        setOpen(false) // close modal on success to match your mock
      } else {
        alert('Something went wrong.')
      }
    } catch (err) {
      alert('Network error. Is the backend running on port 5000?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='page' style={{ backgroundImage: `url(${bg})` }}>
      <header className='header'>
        <img src={logo} alt='SeekKrr' className='logo' />
      </header>

      <main className='hero'>
        <h1 className='title'>
          When was the last time you felt like <span className='bold'>Columbus?</span>
        </h1>
        <p className='subtitle'>
          Turn every city into your playground with story-driven quests crafted by locals
        </p>

        {!submitted ? (
          <button className='cta' onClick={() => setOpen(true)}>Show Interest</button>
        ) : (
          <div className='thankyou'>Thank you for your Support</div>
        )}
      </main>

      <Modal open={open} onClose={() => setOpen(false)}>
        {!submitted ? (
          <form className='form' onSubmit={handleSubmit}>
            <h2>Thank you for your Support</h2>
            <label>
              Name (optional)
              <input name='name' value={form.name} onChange={handleChange} placeholder='Your name' />
            </label>
            <label>
              Email (optional)
              <input name='email' type='email' value={form.email} onChange={handleChange} placeholder='you@example.com' />
            </label>
            <label>
              Phone (optional)
              <input name='phone' value={form.phone} onChange={handleChange} placeholder='+91 98765 43210' />
            </label>
            <button className='cta' type='submit' disabled={loading}>
              {loading ? 'Submitting…' : 'Submit'}
            </button>
          </form>
        ) : (
          <div className='thankyou big'>Thank you for your Support</div>
        )}
      </Modal>
    </div>
  )
}
