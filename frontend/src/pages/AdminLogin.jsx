import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from '../config/api';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/admin/login`, { email, password });
      onLogin(res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
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
      <div style={{ width: '100%', maxWidth: '450px', padding: '2rem' }}>
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
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⚙️</h1>
            <h3 style={{ margin: '0.5rem 0 0 0', fontWeight: '700', fontSize: '1.5rem' }}>Admin Portal</h3>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>RocketWheel Management</p>
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
                  placeholder="admin@rocketwheel.com"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    border: '2px solid #E2E8F0',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
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
                    fontFamily: 'inherit',
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

            <div style={{
              marginTop: '1.5rem',
              textAlign: 'center',
              fontSize: '0.85rem',
              color: '#64748B',
              padding: '1rem',
              background: '#EFF6FF',
              borderRadius: '8px',
              border: '1px solid #DBEAFE'
            }}>
              💡 <strong>First login</strong> creates your admin account automatically
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '1rem',
            textAlign: 'center',
            borderTop: '1px solid #e0e0e0',
            backgroundColor: '#f8f9fa',
            borderRadius: '0 0 12px 12px'
          }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: '#FF6B35',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '500'
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
          <p style={{ margin: 0 }}>🚀 RocketWheel Admin Panel</p>
          <p style={{ margin: 0 }}>Multi-Vendor Delivery Management System</p>
        </div>
      </div>
    </div>
  );
}


