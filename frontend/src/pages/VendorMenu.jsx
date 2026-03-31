import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../config/api';

function resolveImageSrc(imageUrl) {
  if (!imageUrl) return '';
  return /^https?:\/\//i.test(imageUrl) ? imageUrl : `${API}${imageUrl}`;
}

export default function VendorMenu() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ vendor: null, products: [], banner: null });
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supportPhone, setSupportPhone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const cartStorageKey = `rw_cart_${vendorId}`;

  useEffect(() => {
    axios.get(`${API}/api/public/vendors/${vendorId}`)
      .then(res => {
        setData(res.data);
        const centralSupportPhone = res.data.centralSupportPhone || process.env.REACT_APP_CENTRAL_PHONE || '';
        setSupportPhone(centralSupportPhone);
      })
      .catch(err => {
        console.error('Error loading vendor:', err);
        alert('Failed to load vendor. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [vendorId]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(cartStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch (err) {
      console.warn('Failed to load cart from storage', err);
    }
  }, [cartStorageKey]);

  useEffect(() => {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }, [cart, cartStorageKey]);

  function addToCart(p) {
    const existing = cart.find(c => c._id === p._id);
    if (existing) {
      setCart(cart.map(c => c._id === p._id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...p, qty: 1 }]);
    }
  }

  function getCartQty(productId) {
    return cart.find(c => c._id === productId)?.qty || 0;
  }

  function increaseFromMenu(product) {
    addToCart(product);
  }

  function decreaseFromMenu(product) {
    const qty = getCartQty(product._id);
    if (qty > 0) {
      if (qty === 1) {
        setCart(cart.filter(c => c._id !== product._id));
      } else {
        setCart(cart.map(c => c._id === product._id ? { ...c, qty: c.qty - 1 } : c));
      }
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fafaf9' }}>
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div className="skeleton" style={{ height: '170px', borderRadius: '18px', marginBottom: '1rem' }}></div>
          <div className="skeleton" style={{ height: '62px', borderRadius: '12px', marginBottom: '1rem' }}></div>
          <div className="row">
            {[1, 2, 3].map((n) => (
              <div key={n} className="skeleton" style={{ height: '240px', borderRadius: '14px' }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data.vendor) {
    return (
      <div className="container p-5 text-center">
        <h3 className="text-danger">Vendor not found</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
          Back to Vendors
        </button>
      </div>
    );
  }

  const availableCategories = [...new Set(
    data.products
      .map((p) => (p.category || '').trim())
      .filter(Boolean)
  )];

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header with Back Button */}
      <div style={{
        background: 'linear-gradient(135deg, #1E40AF 0%, #1A3A8A 50%, #3B82F6 100%)',
        color: 'white',
        padding: '1.5rem 0',
        boxShadow: '0 12px 24px rgba(30, 64, 175, 0.12)',
        position: 'relative'
      }}>
        <div className="container d-flex flex-between align-items-center">
          <button 
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '0.6rem 1.2rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.25)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.15)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ← Back
          </button>
          <h2 style={{ margin: 0, flex: 1, textAlign: 'center', fontWeight: '700', fontSize: '1.8rem' }}>{data.vendor.name}</h2>
          <div style={{ width: '100px' }}></div>
        </div>
      </div>

      {/* Banner */}
      {data.banner && (
        <div style={{ maxHeight: '250px', overflow: 'hidden' }}>
          <img 
            src={`${API}${data.banner.imageUrl}`} 
            alt="banner" 
            style={{ width: '100%', height: '250px', objectFit: 'cover' }} 
          />
        </div>
      )}

      {/* Restaurant Photo */}
      {data.vendor.photo && !data.banner && (
        <div style={{ maxHeight: '300px', overflow: 'hidden', background: '#f8f9fa' }}>
          <img 
            src={`${API}${data.vendor.photo}`} 
            alt={data.vendor.name} 
            style={{ width: '100%', height: '300px', objectFit: 'cover' }} 
          />
        </div>
      )}

      {/* Vendor Info */}
      <div className="container p-3" style={{ backgroundColor: 'white', borderBottom: '2px solid #E0E7FF' }}>
        <p style={{ marginBottom: '0.5rem' }}>
          <span style={{
            background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
            color: 'white',
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            marginRight: '0.5rem',
            display: 'inline-block',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}>
            {data.vendor.category}
          </span>
          <span style={{ color: '#475569' }}>📍 {data.vendor.address}</span>
        </p>
        <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: 0 }}>
          📞 {data.vendor.phone}
        </p>
        <p style={{ color: '#1E3A8A', fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: 0, fontWeight: '600' }}>
          🛟 Customer Support: {supportPhone || 'Not available'}
        </p>
      </div>

      <div className="container p-4">
        {/* Menu Section */}
        <div className="col">
            <div style={{ paddingBottom: cart.length > 0 ? '140px' : '0' }}>
            <h4 style={{ color: '#1E40AF', marginBottom: '1.5rem', fontWeight: '700', fontSize: '1.4rem' }}>
              📋 Our Menu
            </h4>

            {/* Search Box */}
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="🔍 Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '0.95rem',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  backgroundColor: 'white',
                  boxShadow: '0 4px 12px rgba(30, 64, 175, 0.08)',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3B82F6';
                  e.target.style.boxShadow = '0 4px 12px rgba(30, 64, 175, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#CBD5E1';
                  e.target.style.boxShadow = '0 4px 12px rgba(30, 64, 175, 0.08)';
                }}
              />
            </div>

            {/* Category Filter */}
            {data.products.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ marginBottom: '0.75rem', fontWeight: '600', color: '#1E40AF', fontSize: '0.9rem' }}>
                  Filter by Category
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    fontSize: '0.95rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '10px',
                    backgroundColor: 'white',
                    boxShadow: '0 4px 12px rgba(30, 64, 175, 0.08)',
                    outline: 'none'
                  }}
                >
                  <option value="">All</option>
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {availableCategories.length === 0 && (
                  <p style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '0.82rem', color: '#94A3B8' }}>
                    No categories are set for these products yet.
                  </p>
                )}
              </div>
            )}

            {data.products.length === 0 ? (
              <div className="card border-0 shadow-md p-5 text-center" style={{
                backgroundColor: '#EFF6FF',
                borderLeft: '4px solid #3B82F6'
              }}>
                <h5 style={{ color: '#1E40AF' }}>No products available</h5>
                <p className="text-muted mt-2">Come back soon!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {data.products
                  .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .filter(p => selectedCategory === '' || (p.category || '').trim() === selectedCategory)
                  .map(p => (
                  <div key={p._id} className="card" style={{
                    borderRadius: '14px',
                    boxShadow: '0 10px 22px rgba(30, 64, 175, 0.08)',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 16px 32px rgba(30, 64, 175, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 22px rgba(30, 64, 175, 0.08)';
                  }}>
                    <div className="vendor-menu-item-grid" style={{
                      display: 'grid',
                      gridTemplateColumns: '130px 1fr',
                      gap: '0.9rem',
                      padding: '0.9rem'
                    }}>
                      <div className="vendor-menu-item-media" style={{
                        width: '130px',
                        height: '110px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)'
                      }}>
                        {p.imageUrl ? (
                          <img
                            src={resolveImageSrc(p.imageUrl)}
                            alt={p.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🍽️</div>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                        <div>
                          <h6 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#1E293B' }}>{p.name}</h6>
                          <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
                            {p.description || 'Freshly prepared and delivered fast.'}
                          </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.8rem' }}>
                          <div style={{ fontSize: '1.08rem', fontWeight: '700', color: '#1E40AF' }}>₹{p.price}</div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            {getCartQty(p._id) > 0 ? (
                              <>
                                <button
                                  onClick={() => decreaseFromMenu(p)}
                                  style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '8px',
                                    border: '1px solid #BFDBFE',
                                    background: 'white',
                                    color: '#1E40AF',
                                    cursor: 'pointer',
                                    fontWeight: '700'
                                  }}
                                >
                                  -
                                </button>
                                <span style={{ minWidth: '18px', textAlign: 'center', fontWeight: '700', color: '#1E40AF' }}>
                                  {getCartQty(p._id)}
                                </span>
                                <button
                                  onClick={() => increaseFromMenu(p)}
                                  style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontWeight: '700'
                                  }}
                                >
                                  +
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => addToCart(p)}
                                className="btn btn-primary btn-small"
                                style={{
                                  padding: '0.45rem 0.85rem',
                                  borderRadius: '8px',
                                  fontSize: '0.85rem',
                                  boxShadow: '0 8px 18px rgba(30, 64, 175, 0.2)'
                                }}
                              >
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {data.products.length > 0 && 
             data.products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
              <div className="card border-0 shadow-md p-5 text-center" style={{
                backgroundColor: '#FEF2F2',
                borderLeft: '4px solid #EF4444'
              }}>
                <h5 style={{ color: '#991B1B' }}>No items found</h5>
                <p className="text-muted mt-2">Try searching with different keywords</p>
              </div>
            )}
            </div>
        </div>
      </div>

      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: '1px solid #DBEAFE',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)',
        boxShadow: '0 -8px 24px rgba(30, 64, 175, 0.12)',
        zIndex: 40
      }}>
        <div className="container p-4" style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => navigate(`/menu/${vendorId}/cart`)}
            className="btn"
            style={{
              background: 'linear-gradient(135deg, #1E40AF 0%, #1A3A8A 50%, #3B82F6 100%)',
              color: 'white',
              fontWeight: '700',
              border: 'none',
              borderRadius: '10px',
              padding: '0.8rem 1.4rem',
              minWidth: '240px'
            }}
          >
            Go to Cart ({cart.reduce((s, i) => s + i.qty, 0)} items)
          </button>
        </div>
      </div>

      {cart.length > 0 && (
        <button
          className="mobile-cart-fab"
          onClick={() => navigate(`/menu/${vendorId}/cart`)}
        >
          Cart ({cart.reduce((s, i) => s + i.qty, 0)})
        </button>
      )}
    </div>
  );
}




