import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from '../config/api';

export default function VendorLogin({ onLogin }) {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Restaurant');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/api/vendor/login`, { email, password });
      onLogin(res.data.token, res.data.vendor._id);
      navigate('/vendor/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/api/vendor/register`, { name, email, password, category, address, phone });
      setSuccess('✅ Registration successful! Awaiting admin approval. You can login once approved.');
      setTimeout(() => {
        setTab('login');
        setEmail('');
        setPassword('');
        setName('');
        setCategory('Restaurant');
        setAddress('');
        setPhone('');
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1E40AF 0%, #1A3A8A 50%, #3B82F6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 0'
    }}>
      <div style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
        <div className="card shadow-xl rounded-lg border-0">
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1E40AF 0%, #1A3A8A 50%, #3B82F6 100%)',
            color: 'white',
            padding: '2rem',
            textAlign: 'center',
            borderRadius: '12px 12px 0 0',
            boxShadow: '0 12px 24px rgba(30, 64, 175, 0.15)'
          }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🍔</h1>
            <h3 style={{ margin: '0.5rem 0 0 0', fontWeight: '700', fontSize: '1.5rem' }}>Vendor Portal</h3>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>Manage your business with RocketWheel</p>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '2px solid #E2E8F0',
            backgroundColor: '#EFF6FF'
          }}>
            <button
              onClick={() => {
                setTab('login');
                setError('');
                setSuccess('');
              }}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                color: tab === 'login' ? '#1E40AF' : '#64748B',
                borderBottom: tab === 'login' ? '3px solid #1E40AF' : 'none',
                marginBottom: '-2px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (tab !== 'login') e.target.style.color = '#1E40AF';
              }}
              onMouseLeave={(e) => {
                if (tab !== 'login') e.target.style.color = '#64748B';
              }}
            >
              🔐 Login
            </button>
            <button
              onClick={() => {
                setTab('register');
                setError('');
                setSuccess('');
              }}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                color: tab === 'register' ? '#1E40AF' : '#64748B',
                borderBottom: tab === 'register' ? '3px solid #1E40AF' : 'none',
                marginBottom: '-2px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (tab !== 'register') e.target.style.color = '#1E40AF';
              }}
              onMouseLeave={(e) => {
                if (tab !== 'register') e.target.style.color = '#64748B';
              }}
            >
              ✍️ Register
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '2.5rem' }}>
            {error && (
              <div style={{
                background: 'linear-gradient(135deg, #FEE2E2 0%, #FEF2F2 100%)',
                border: '1px solid #FECACA',
                color: '#7F1D1D',
                padding: '1rem',
                borderRadius: '10px',
                marginBottom: '1.5rem',
                fontWeight: '500'
              }}>
                ❌ {error}
              </div>
            )}

            {success && (
              <div style={{
                background: 'linear-gradient(135deg, #D1FAE5 0%, #ECFDF5 100%)',
                border: '1px solid #A7F3D0',
                color: '#065F46',
                padding: '1rem',
                borderRadius: '10px',
                marginBottom: '1.5rem',
                fontWeight: '500'
              }}>
                {success}
              </div>
            )}

            {tab === 'login' ? (
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.6rem',
                    fontWeight: '600',
                    color: '#1E40AF',
                    fontSize: '0.95rem'
                  }}>
                    📧 Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="vendor@example.com"
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #E2E8F0',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3B82F6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.6rem',
                    fontWeight: '600',
                    color: '#1E40AF',
                    fontSize: '0.95rem'
                  }}>
                    🔐 Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #E2E8F0',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3B82F6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    background: loading ? '#CBD5E1' : 'linear-gradient(135deg, #1E40AF 0%, #1A3A8A 50%, #3B82F6 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '1rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: loading ? 'none' : '0 4px 12px rgba(30, 64, 175, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 12px 24px rgba(30, 64, 175, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(30, 64, 175, 0.2)';
                  }}
                >
                  {loading ? '⏳ Logging in...' : '🚀 Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.6rem',
                    fontWeight: '600',
                    color: '#1E40AF',
                    fontSize: '0.95rem'
                  }}>
                    🏪 Business Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your restaurant or store name"
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #E2E8F0',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3B82F6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.6rem',
                    fontWeight: '600',
                    color: '#1E40AF',
                    fontSize: '0.95rem'
                  }}>
                    📧 Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="vendor@example.com"
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #E2E8F0',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3B82F6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.6rem',
                    fontWeight: '600',
                    color: '#1E40AF',
                    fontSize: '0.95rem'
                  }}>
                    🔐 Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #E2E8F0',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3B82F6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.6rem',
                    fontWeight: '600',
                    color: '#1E40AF',
                    fontSize: '0.95rem'
                  }}>
                    📂 Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #E2E8F0',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box',
                      background: 'white',
                      color: '#1E293B'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3B82F6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option>🍔 Restaurant</option>
                    <option>🛒 Grocery</option>
                    <option>💊 Pharmacy</option>
                    <option>📱 Electronics</option>
                    <option>🏪 Other</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.6rem',
                    fontWeight: '600',
                    color: '#1E40AF',
                    fontSize: '0.95rem'
                  }}>
                    📍 Business Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Complete address"
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #E2E8F0',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3B82F6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.6rem',
                    fontWeight: '600',
                    color: '#1E40AF',
                    fontSize: '0.95rem'
                  }}>
                    📞 Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="91XXXXXXXXXX"
                    style={{
                      width: '100%',
                      padding: '0.8rem',
                      border: '2px solid #E2E8F0',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3B82F6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(30, 64, 175, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    background: loading ? '#CBD5E1' : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '1rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: loading ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.2)';
                  }}
                >
                  {loading ? '⏳ Registering...' : '✨ Create Account'}
                </button>

                <p style={{
                  marginTop: '1rem',
                  fontSize: '0.85rem',
                  color: '#64748B',
                  textAlign: 'center',
                  padding: '1rem',
                  background: '#EFF6FF',
                  borderRadius: '8px',
                  border: '1px solid #DBEAFE'
                }}>
                  💡 Admin will review and approve your registration shortly
                </p>
              </form>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '1rem',
            textAlign: 'center',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#EFF6FF',
            borderRadius: '0 0 12px 12px'
          }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: '#1E40AF',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.color = '#3B82F6';
              }}
              onMouseLeave={(e) => {
                e.target.style.color = '#1E40AF';
              }}
            >
              ← Back to Home
            </button>
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          textAlign: 'center',
          color: 'white',
          fontSize: '0.9rem',
          opacity: 0.9
        }}>
          <p style={{ margin: 0, fontWeight: '500' }}>🚀 RocketWheel Vendor Dashboard</p>
          <p style={{ margin: '0.5rem 0 0 0' }}>Grow your business with us</p>
        </div>
      </div>
    </div>
  );
}


