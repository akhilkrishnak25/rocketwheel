import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from '../config/api';

const GOOGLE_PLAY_BADGE_SRC = 'https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png';

export default function Vendors() {
  const [grouped, setGrouped] = useState({});
  const [banners, setBanners] = useState([]);
  const [supportPhone, setSupportPhone] = useState('');
  const [loadError, setLoadError] = useState('');
  const [isServiceUnavailable, setIsServiceUnavailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isBannerHovered, setIsBannerHovered] = useState(false);
  const [isDraggingBanner, setIsDraggingBanner] = useState(false);
  const [dragDeltaX, setDragDeltaX] = useState(0);
  const dragStartXRef = useRef(0);
  const bannerViewportRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/public/vendors`),
      axios.get(`${API}/api/public/banners`),
      axios.get(`${API}/api/public/support`)
    ])
      .then(([vendorsRes, bannersRes, supportRes]) => {
        setGrouped(vendorsRes.data);
        setBanners(bannersRes.data || []);
        setSupportPhone(supportRes.data?.phone || '');
        setLoadError('');
        setIsServiceUnavailable(false);
      })
      .catch((err) => {
        console.error(err);
        setGrouped({});
        const status = err?.response?.status;
        const serverMessage = err?.response?.data?.error || err?.message || 'Unable to load vendors right now.';
        const dbDown = /database connection is down|temporarily unavailable|buffering timed out/i.test(serverMessage || '');
        const isUnavailable = status === 503 || dbDown;
        setIsServiceUnavailable(isUnavailable);
        setLoadError(
          isUnavailable
            ? 'Service is temporarily unavailable. Please retry in a few moments.'
            : serverMessage
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const defaultPlayStoreUrl = process.env.REACT_APP_PLAYSTORE_URL || 'https://play.google.com/store/apps/details?id=com.rocketwheel.app';
  const quickFilters = ['All', ...Object.keys(grouped).slice(0, 8)];

  useEffect(() => {
    if (banners.length === 0) return;
    if (currentBanner > banners.length - 1) {
      setCurrentBanner(0);
    }
  }, [banners, currentBanner]);

  useEffect(() => {
    if (banners.length <= 1 || isBannerHovered || isDraggingBanner) return;

    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [banners.length, isBannerHovered, isDraggingBanner]);

  function goToBanner(index) {
    if (!banners.length) return;
    const normalized = (index + banners.length) % banners.length;
    setCurrentBanner(normalized);
  }

  function handleBannerPointerDown(e) {
    if (e.target.closest && e.target.closest('a')) {
      return;
    }
    setIsDraggingBanner(true);
    dragStartXRef.current = e.clientX;
    setDragDeltaX(0);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }

  function handleBannerPointerMove(e) {
    if (!isDraggingBanner) return;
    setDragDeltaX(e.clientX - dragStartXRef.current);
  }

  function handleBannerPointerUp() {
    if (!isDraggingBanner) return;

    const threshold = 50;
    if (dragDeltaX <= -threshold) {
      goToBanner(currentBanner + 1);
    } else if (dragDeltaX >= threshold) {
      goToBanner(currentBanner - 1);
    }

    setIsDraggingBanner(false);
    setDragDeltaX(0);
  }

  function getPlayStoreLink(url) {
    const raw = (url || defaultPlayStoreUrl || '').trim();
    if (!raw) return 'https://play.google.com/store';
    if (/^https?:\/\//i.test(raw)) return raw;
    return `https://${raw}`;
  }

  const filteredVendors = Object.keys(grouped).reduce((acc, cat) => {
    const query = searchTerm.toLowerCase();
    const filtered = grouped[cat].filter(v => 
      v.name.toLowerCase().includes(query) ||
      v.address.toLowerCase().includes(query) ||
      cat.toLowerCase().includes(query)
    );
    if (filtered.length > 0) {
      acc[cat] = filtered;
    }
    return acc;
  }, {});

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fafaf9 0%, #ffffff 100%)',
      }}>
        <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
          <div className="skeleton" style={{ height: '190px', borderRadius: '20px', marginBottom: '1rem' }}></div>
          <div className="skeleton" style={{ height: '76px', borderRadius: '14px', marginBottom: '1.2rem' }}></div>
          <div className="row">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="skeleton" style={{ height: '290px', borderRadius: '16px' }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vendors-page">
      {/* Premium Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #112E87 0%, #2A52BE 50%, #0C2162 100%)',
        color: 'white',
        padding: 'clamp(1rem, 4vw, 4rem) 0',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Decorative Background */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '5%',
          width: '400px',
          height: '400px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%'
        }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'clamp(1rem, 3vw, 3rem)', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{
                fontSize: 'clamp(1.85rem, 7.2vw, 3.5rem)',
                margin: 0,
                fontWeight: 900,
                letterSpacing: '-2px',
                textShadow: '0 4px 20px rgba(0,0,0,0.1)',
                color: 'white'
              }}>
                🚀 RocketWheel
              </h1>
              <p style={{
                margin: '0.75rem 0 0 0',
                fontSize: 'clamp(0.92rem, 3.6vw, 1.25rem)',
                opacity: 0.95,
                fontWeight: 500
              }}>
                Discover & order from your favorite restaurants
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button
                onClick={() => navigate('/vendor/login')}
                style={{
                  padding: '0.875rem 1.75rem',
                  background: 'rgba(255,255,255,0.2)',
                  border: '2px solid white',
                  color: 'white',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#112E87';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.color = 'white';
                }}
              >
                🍔 Vendor Portal
              </button>
              <button
                onClick={() => navigate('/admin/login')}
                style={{
                  padding: '0.875rem 1.75rem',
                  background: 'white',
                  border: '2px solid white',
                  color: '#112E87',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FFF7ED';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                ⚙️ Admin Panel
              </button>
            </div>
          </div>

          {/* Premium Search Bar */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                placeholder="Search vendors by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1.1rem 1.75rem',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                  fontWeight: '500',
                  fontFamily: 'inherit',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = '0 15px 50px rgba(0,0,0,0.3)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.2)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
              <span style={{
                position: 'absolute',
                right: '1.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.25rem',
                color: '#999'
              }}>
                🔍
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '0.6rem',
            marginTop: '0.9rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem'
          }}>
            {quickFilters.map((chip) => {
              const active = chip === 'All' ? searchTerm.trim() === '' : searchTerm.toLowerCase() === chip.toLowerCase();
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setSearchTerm(chip === 'All' ? '' : chip)}
                  style={{
                    border: active ? '1px solid #E83E6D' : '1px solid rgba(255,255,255,0.35)',
                    background: active ? '#E83E6D' : 'rgba(255,255,255,0.14)',
                    color: 'white',
                    borderRadius: '999px',
                    padding: '0.42rem 0.9rem',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: active ? '0 8px 20px rgba(232,62,109,0.35)' : 'none'
                  }}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #F8FAFC 0%, #FFF3E8 100%)',
        borderBottom: '1px solid #FFE0C4'
      }}>
        <div className="container" style={{ paddingTop: '1.25rem', paddingBottom: '1.25rem' }}>
          <div style={{
            background: 'white',
            border: '1px solid #FFD1A1',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <div>
              <p style={{ margin: 0, color: '#B45309', fontWeight: '700' }}>Customer Support</p>
              <p style={{ margin: '0.3rem 0 0 0', color: '#475569', fontSize: '0.95rem' }}>
                {supportPhone
                  ? `Central Support Number: ${supportPhone}`
                  : isServiceUnavailable
                    ? 'Support details are temporarily unavailable. Please retry shortly.'
                    : 'Support number will be updated soon'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
              {supportPhone && (
                <a
                  href={`tel:${supportPhone}`}
                  style={{
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, #E23744 0%, #112E87 100%)',
                    color: 'white',
                    borderRadius: '8px',
                    padding: '0.55rem 0.95rem',
                    fontWeight: '700',
                    fontSize: '0.88rem'
                  }}
                >
                  Call Support
                </a>
              )}
              {supportPhone && (
                <a
                  href={`https://api.whatsapp.com/send?phone=${supportPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: 'none',
                    background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                    color: 'white',
                    borderRadius: '8px',
                    padding: '0.55rem 0.95rem',
                    fontWeight: '700',
                    fontSize: '0.88rem'
                  }}
                >
                  WhatsApp Support
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {banners.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #E0F2FE 0%, #FFFFFF 100%)',
          borderTop: '1px solid #FFD1A1',
          borderBottom: '1px solid #FFD1A1',
          padding: '1rem 0'
        }}>
          <div className="container" style={{ padding: '0 1rem' }}>
            <div style={{ marginBottom: '0.75rem', color: '#B45309', fontWeight: '700' }}>
              Get RocketWheel App on Play Store
            </div>
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setIsBannerHovered(true)}
              onMouseLeave={() => setIsBannerHovered(false)}
            >
              {banners.length > 1 && (
                <button
                  onClick={() => goToBanner(currentBanner - 1)}
                  aria-label="Previous banner"
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 5,
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'rgba(15, 23, 42, 0.72)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1.1rem'
                  }}
                >
                  {'<'}
                </button>
              )}

              <div
                ref={bannerViewportRef}
                style={{ overflow: 'hidden', borderRadius: '14px', touchAction: 'pan-y' }}
                onPointerDown={handleBannerPointerDown}
                onPointerMove={handleBannerPointerMove}
                onPointerUp={handleBannerPointerUp}
                onPointerCancel={handleBannerPointerUp}
                onPointerLeave={handleBannerPointerUp}
              >
                <div
                  style={{
                    display: 'flex',
                    transform: `translateX(calc(${-currentBanner * 100}% + ${dragDeltaX}px))`,
                    transition: isDraggingBanner ? 'none' : 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)'
                  }}
                >
                  {banners.map((b) => (
                    <div
                      key={b._id}
                      style={{
                        width: '100%',
                        minWidth: '100%',
                        background: 'white',
                        border: '1px solid #FFE0C4',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 20px rgba(252, 128, 25, 0.08)'
                      }}
                    >
                      <div style={{ height: '220px', background: '#FFF3E8' }}>
                        <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                          <img
                            src={`${API}${b.imageUrl}`}
                            alt={b.title || 'RocketWheel banner'}
                            style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                          />
                          <a
                            href={getPlayStoreLink(b.playStoreUrl)}
                            target="_blank"
                            rel="noreferrer"
                            onPointerDown={(e) => e.stopPropagation()}
                            onPointerMove={(e) => e.stopPropagation()}
                            onPointerUp={(e) => e.stopPropagation()}
                            style={{
                              position: 'absolute',
                              right: '10px',
                              bottom: '10px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'rgba(255,255,255,0.96)',
                              borderRadius: '8px',
                              padding: '4px 6px',
                              boxShadow: '0 6px 16px rgba(15, 23, 42, 0.28)',
                              textDecoration: 'none',
                              pointerEvents: isDraggingBanner ? 'none' : 'auto'
                            }}
                          >
                            <img
                              src={GOOGLE_PLAY_BADGE_SRC}
                              alt="Get it on Google Play"
                              style={{
                                width: 'clamp(120px, 30vw, 160px)',
                                height: 'auto',
                                maxWidth: '100%',
                                display: 'block'
                              }}
                            />
                          </a>
                        </div>
                      </div>
                      <div style={{ padding: '0.95rem' }}>
                        <p style={{ margin: 0, color: '#1E293B', fontWeight: '700', fontSize: '1rem' }}>
                          {b.title || 'RocketWheel App'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {banners.length > 1 && (
                <button
                  onClick={() => goToBanner(currentBanner + 1)}
                  aria-label="Next banner"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 5,
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'rgba(15, 23, 42, 0.72)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '1.1rem'
                  }}
                >
                  {'>'}
                </button>
              )}
            </div>

            {banners.length > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.45rem', marginTop: '0.8rem' }}>
                {banners.map((b, index) => (
                  <button
                    key={`${b._id}-dot`}
                    onClick={() => goToBanner(index)}
                    aria-label={`Go to banner ${index + 1}`}
                    style={{
                      width: index === currentBanner ? '22px' : '9px',
                      height: '9px',
                      borderRadius: '999px',
                      border: 'none',
                      cursor: 'pointer',
                      background: index === currentBanner ? '#112E87' : '#F5A524',
                      transition: 'all 220ms ease'
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container vendors-content" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        {loadError ? (
          <div style={{
            background: 'linear-gradient(135deg, #FEF2F2 0%, #FFF1F2 100%)',
            border: '2px solid #FCA5A5',
            borderRadius: '16px',
            padding: '3rem 2rem',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#B91C1C', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              {isServiceUnavailable ? 'Service temporarily unavailable' : 'Unable to load vendors'}
            </h3>
            <p style={{ color: '#7F1D1D', fontSize: '1rem', marginBottom: '1rem' }}>
              {loadError}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                background: '#DC2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.6rem 1rem',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Retry
            </button>
          </div>
        ) : Object.keys(filteredVendors).length === 0 ? (
          <div style={{
            background: 'linear-gradient(135deg, #FFF3E8 0%, #F0FAFF 100%)',
            border: '2px solid #F5A524',
            borderRadius: '16px',
            padding: '3rem 2rem',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#0369A1', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              No vendors found
            </h3>
            <p style={{ color: '#0C6488', fontSize: '1rem' }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Check back soon for amazing restaurants!'}
            </p>
          </div>
        ) : (
          Object.keys(filteredVendors).map(cat => (
            <div key={cat} style={{ marginBottom: '4rem' }}>
              {/* Category Header */}
              <div className="vendors-category">
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #112E87 0%, #2A52BE 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  color: 'white',
                  fontWeight: '700'
                }}>
                  {cat[0]}
                </div>
                <div>
                  <h2 style={{ color: '#212529', marginBottom: '0.25rem' }}>{cat}</h2>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
                    {filteredVendors[cat].length} restaurant{filteredVendors[cat].length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Vendor Cards Grid */}
              <div className="row">
                {filteredVendors[cat].map(v => (
                  <div key={v._id} className="col" style={{
                    animation: 'fadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}>
                    <div
                      className="vendors-card"
                      style={{
                        position: 'relative',
                        borderTop: '4px solid #112E87'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-10px)';
                        e.currentTarget.style.boxShadow = '0 30px 60px rgba(252, 128, 25, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(252, 128, 25, 0.1)';
                      }}
                    >
                      {/* Premium Header Banner / Photo */}
                      <div style={{
                        background: v.photo 
                          ? `url('${API}${v.photo}') center/cover` 
                          : 'linear-gradient(135deg, #112E87 0%, #2A52BE 100%)',
                        height: '140px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}>
                        {!v.photo && (
                          <>
                            <div style={{
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3CradialGradient id="grad" cx="50%" cy="50%" r="50%"%3E%3Cstop offset="0%" style="stop-color:rgb(255,255,255,0.2);stop-opacity:1" /%3E%3Cstop offset="100%" style="stop-color:rgb(255,255,255,0);stop-opacity:1" /%3E%3C/radialGradient%3E%3C/defs%3E%3Ccircle cx="30" cy="30" r="30" fill="url(%23grad)" /%3E%3C/svg%3E")',
                              opacity: 0.4
                            }}></div>
                            <div style={{
                              position: 'relative',
                              fontSize: '3rem'
                            }}>
                              🍽️
                            </div>
                          </>
                        )}
                        {v.photo && (
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15))'
                          }}></div>
                        )}
                      </div>

                      <div className="vendors-card-body" style={{ position: 'relative' }}>
                        <h5 style={{
                          color: '#212529',
                          fontWeight: '700',
                          marginBottom: '0.75rem',
                          fontSize: '1.2rem'
                        }}>
                          {v.name}
                        </h5>

                        <div style={{ marginBottom: '1.25rem' }}>
                          <p style={{
                            fontSize: '0.9rem',
                            color: '#6c757d',
                            marginBottom: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            📍 {v.address}
                          </p>
                          <p style={{
                            fontSize: '0.9rem',
                            color: '#6c757d',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            📞 {v.phone}
                          </p>
                        </div>

                        {v.approved && (
                          <div style={{ marginBottom: '1rem' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              padding: '0.45rem 0.9rem',
                              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
                              color: '#10B981',
                              borderRadius: '20px',
                              fontSize: '0.75rem',
                              fontWeight: '700',
                              border: '1px solid rgba(16, 185, 129, 0.2)'
                            }}>
                              ✓ Verified
                            </span>
                          </div>
                        )}

                        <button
                          className="vendors-card-cta"
                          onClick={() => navigate(`/menu/${v._id}`)}
                          style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, #112E87 0%, #2A52BE 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '0.875rem',
                            borderRadius: '10px',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            letterSpacing: '0.5px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 12px 24px rgba(252, 128, 25, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          Browse Menu →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Premium Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        color: 'white',
        padding: '3rem 0',
        marginTop: '4rem',
        textAlign: 'center',
        borderTop: '3px solid #112E87'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginBottom: '1.5rem',
            fontSize: '1.1rem'
          }}>
            <div>
              <span style={{ fontWeight: '600' }}>📱</span> Mobile Friendly
            </div>
            <div>
              <span style={{ fontWeight: '600' }}>🔒</span> Secure Ordering
            </div>
            <div>
              <span style={{ fontWeight: '600' }}>⚡</span> Fast Delivery
            </div>
          </div>
          <p style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
            <strong>🚀 RocketWheel</strong> - Multi-Vendor Digital Menu & Delivery Management
          </p>
          <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: 0 }}>
            © 2026 RocketWheel. All rights reserved. | <span style={{ cursor: 'pointer' }}>Privacy Policy</span> | <span style={{ cursor: 'pointer' }}>Terms of Service</span>
          </p>
        </div>
      </footer>
    </div>
  );
}




