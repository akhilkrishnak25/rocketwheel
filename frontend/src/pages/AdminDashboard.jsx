import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from '../config/api';

export default function AdminDashboard({ token, onLogout }) {
  const [tab, setTab] = useState('vendors');
  const [vendors, setVendors] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [newDeliveryName, setNewDeliveryName] = useState('');
  const [newDeliveryPhone, setNewDeliveryPhone] = useState('');
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPlayStoreUrl, setBannerPlayStoreUrl] = useState('');
  const [banners, setBanners] = useState([]);
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [editingBannerTitle, setEditingBannerTitle] = useState('');
  const [editingBannerPlayStoreUrl, setEditingBannerPlayStoreUrl] = useState('');
  const [editingBannerFile, setEditingBannerFile] = useState(null);
  const [centralPhone, setCentralPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState(null);
  const [assignmentModal, setAssignmentModal] = useState(false);
  const [assignableRestaurants, setAssignableRestaurants] = useState([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState([]);
  const [editingDeliveryBoy, setEditingDeliveryBoy] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingPhone, setEditingPhone] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (tab === 'vendors') loadVendors();
    if (tab === 'delivery') loadDeliveryBoys();
    if (tab === 'banner') loadBanners();
    if (tab === 'central') loadCentralPhone();
  }, [tab]);

  const config = { headers: { Authorization: `Bearer ${token}` } };

  async function loadVendors() {
    try {
      const res = await axios.get(`${API}/api/admin/vendors`, config);
      setVendors(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load vendors');
    }
  }

  async function approveVendor(id) {
    try {
      await axios.post(`${API}/api/admin/vendors/${id}/approve`, {}, config);
      setSuccess('Vendor approved!');
      loadVendors();
    } catch (err) {
      setError('Failed to approve');
    }
  }

  async function rejectVendor(id) {
    try {
      await axios.post(`${API}/api/admin/vendors/${id}/reject`, {}, config);
      setSuccess('Vendor rejected!');
      loadVendors();
    } catch (err) {
      setError('Failed to reject');
    }
  }

  async function toggleVendor(id) {
    try {
      await axios.post(`${API}/api/admin/vendors/${id}/toggle`, {}, config);
      setSuccess('Vendor status updated!');
      loadVendors();
    } catch (err) {
      setError('Failed to update');
    }
  }

  async function loadDeliveryBoys() {
    try {
      const res = await axios.get(`${API}/api/admin/deliveryboys`, config);
      setDeliveryBoys(res.data || []);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error loading delivery boys:', err);
      setError('Failed to load delivery boys: ' + (err.response?.data?.error || err.message));
    }
  }

  async function addDeliveryBoy(e) {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/admin/deliveryboys`, { name: newDeliveryName, phone: newDeliveryPhone }, config);
      setSuccess('Delivery boy added!');
      setNewDeliveryName('');
      setNewDeliveryPhone('');
      loadDeliveryBoys();
    } catch (err) {
      setError('Failed to add delivery boy');
    }
  }

  async function uploadBanner(e) {
    e.preventDefault();
    if (!bannerFile) {
      setError('Please select a file');
      return;
    }
    const formData = new FormData();
    formData.append('image', bannerFile);
    formData.append('title', bannerTitle);
    formData.append('playStoreUrl', bannerPlayStoreUrl);
    try {
      await axios.post(`${API}/api/admin/banners`, formData, { ...config, headers: { ...config.headers, 'Content-Type': 'multipart/form-data' } });
      setSuccess('Banner uploaded!');
      setBannerTitle('');
      setBannerFile(null);
      setBannerPlayStoreUrl('');
      loadBanners();
    } catch (err) {
      setError('Failed to upload banner');
    }
  }

  async function loadBanners() {
    try {
      const res = await axios.get(`${API}/api/admin/banners`, config);
      setBanners(res.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load banners');
    }
  }

  function startBannerEdit(banner) {
    setEditingBannerId(banner._id);
    setEditingBannerTitle(banner.title || '');
    setEditingBannerPlayStoreUrl(banner.playStoreUrl || '');
    setEditingBannerFile(null);
  }

  function cancelBannerEdit() {
    setEditingBannerId(null);
    setEditingBannerTitle('');
    setEditingBannerPlayStoreUrl('');
    setEditingBannerFile(null);
  }

  async function saveBannerEdit(bannerId) {
    try {
      const formData = new FormData();
      formData.append('title', editingBannerTitle);
      formData.append('playStoreUrl', editingBannerPlayStoreUrl);
      if (editingBannerFile) {
        formData.append('image', editingBannerFile);
      }

      await axios.put(`${API}/api/admin/banners/${bannerId}`, formData, {
        ...config,
        headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
      });

      setSuccess('Banner updated!');
      cancelBannerEdit();
      loadBanners();
    } catch (err) {
      setError('Failed to update banner');
    }
  }

  async function deleteBanner(bannerId) {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    try {
      await axios.delete(`${API}/api/admin/banners/${bannerId}`, config);
      setSuccess('Banner deleted!');
      if (editingBannerId === bannerId) {
        cancelBannerEdit();
      }
      loadBanners();
    } catch (err) {
      setError('Failed to delete banner');
    }
  }

  async function setCentral(e) {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/admin/central-delivery`, { phone: centralPhone }, config);
      setSuccess('Central delivery number set!');
      setCentralPhone(res.data?.phone || centralPhone);
    } catch (err) {
      setError('Failed to set central number');
    }
  }

  async function loadCentralPhone() {
    try {
      const res = await axios.get(`${API}/api/admin/central-delivery`, config);
      setCentralPhone(res.data?.phone || '');
    } catch (err) {
      setError('Failed to load central number');
    }
  }

  async function openAssignmentModal(deliveryBoy) {
    try {
      setSelectedDeliveryBoy(deliveryBoy);
      
      // Get all assignable restaurants
      const resRest = await axios.get(`${API}/api/admin/restaurants-for-assignment`, config);
      setAssignableRestaurants(resRest.data || []);
      
      // Get currently assigned restaurants for this delivery boy
      const resAssigned = await axios.get(`${API}/api/admin/deliveryboys/${deliveryBoy._id}/assigned-restaurants`, config);
      const assignedVendors = resAssigned.data?.assignedVendors || [];
      const assignedIds = assignedVendors.map(v => v._id || v);
      setSelectedRestaurants(assignedIds);
      
      setAssignmentModal(true);
    } catch (err) {
      console.error('Error loading assignment modal:', err);
      setError('Failed to load assignment modal: ' + (err.response?.data?.error || err.message));
    }
  }

  async function saveRestaurantAssignment() {
    try {
      await axios.post(`${API}/api/admin/deliveryboys/${selectedDeliveryBoy._id}/assign-restaurants`, 
        { restaurantIds: selectedRestaurants }, 
        config
      );
      setSuccess('Restaurants assigned successfully!');
      setAssignmentModal(false);
      setSelectedDeliveryBoy(null);
      setSelectedRestaurants([]);
      loadDeliveryBoys();
    } catch (err) {
      console.error('Error saving assignment:', err);
      setError('Failed to assign restaurants: ' + (err.response?.data?.error || err.message));
    }
  }

  function toggleRestaurantSelection(restaurantId) {
    setSelectedRestaurants(prev => 
      prev.includes(restaurantId) 
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId]
    );
  }

  async function editDeliveryBoy(deliveryBoy) {
    setEditingDeliveryBoy(deliveryBoy);
    setEditingName(deliveryBoy.name);
    setEditingPhone(deliveryBoy.phone);
  }

  async function saveDeliveryBoyEdit() {
    try {
      await axios.post(`${API}/api/admin/deliveryboys/${editingDeliveryBoy._id}/edit`, 
        { name: editingName, phone: editingPhone }, 
        config
      );
      setSuccess('Delivery boy updated!');
      setEditingDeliveryBoy(null);
      setEditingName('');
      setEditingPhone('');
      loadDeliveryBoys();
    } catch (err) {
      setError('Failed to update delivery boy');
    }
  }

  async function deleteDeliveryBoy(deliveryBoyId) {
    if (window.confirm('Are you sure you want to delete this delivery boy?')) {
      try {
        await axios.post(`${API}/api/admin/deliveryboys/${deliveryBoyId}/delete`, {}, config);
        setSuccess('Delivery boy deleted!');
        loadDeliveryBoys();
      } catch (err) {
        setError('Failed to delete delivery boy');
      }
    }
  }

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container-fluid">
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1E40AF 0%, #1A3A8A 50%, #3B82F6 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          boxShadow: '0 12px 24px rgba(30, 64, 175, 0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontWeight: '700', fontSize: '1.8rem' }}>🛠️ Admin Dashboard</h2>
          <button
            className="btn btn-danger"
            onClick={() => { onLogout(); navigate('/admin/login'); }}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
            }}
          >
            Logout
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{
            background: 'linear-gradient(135deg, #FEE2E2 0%, #FEF2F2 100%)',
            border: '1px solid #FECACA',
            color: '#7F1D1D',
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '1.5rem'
          }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{
            background: 'linear-gradient(135deg, #D1FAE5 0%, #ECFDF5 100%)',
            border: '1px solid #A7F3D0',
            color: '#065F46',
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '1.5rem'
          }}>
            {success}
          </div>
        )}

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: '2px solid #E2E8F0',
          overflowX: 'auto'
        }}>
          {['vendors', 'delivery', 'banner', 'central'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '1rem 1.5rem',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: tab === t ? '#1E40AF' : '#64748B',
                borderBottom: tab === t ? '3px solid #1E40AF' : 'none',
                transition: 'all 0.3s ease',
                textTransform: 'capitalize'
              }}
              onMouseEnter={(e) => {
                if (tab !== t) e.target.style.color = '#1E40AF';
              }}
              onMouseLeave={(e) => {
                if (tab !== t) e.target.style.color = '#64748B';
              }}
            >
              {t === 'vendors' && '🏪 Vendors'}
              {t === 'delivery' && '🛵 Delivery Boys'}
              {t === 'banner' && '🖼️ Banner'}
              {t === 'central' && '📞 Central'}
            </button>
          ))}
        </div>

      {tab === 'vendors' && (
        <div>
          <h4 style={{ color: '#1E40AF', fontWeight: '700', marginBottom: '1.5rem' }}>📋 Pending Vendors</h4>
          <div style={{
            overflowX: 'auto',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(30, 64, 175, 0.1)'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E2E8F0', background: '#EFF6FF' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1E40AF' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1E40AF' }}>Email</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1E40AF' }}>Category</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1E40AF' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1E40AF' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v, idx) => (
                  <tr key={v._id} style={{
                    borderBottom: '1px solid #E2E8F0',
                    background: idx % 2 === 0 ? 'white' : '#F8FAFC'
                  }}>
                    <td style={{ padding: '1rem', color: '#1E293B', fontWeight: '500' }}>{v.name}</td>
                    <td style={{ padding: '1rem', color: '#64748B' }}>{v.email}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)',
                        color: '#1E40AF',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        {v.category}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#64748B', fontSize: '0.9rem' }}>
                      <span style={{
                        background: v.approved ? '#D1FAE5' : '#FEE2E2',
                        color: v.approved ? '#065F46' : '#7F1D1D',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        marginRight: '0.5rem'
                      }}>
                        {v.approved ? 'Approved' : 'Pending'}
                      </span>
                      <span style={{
                        background: v.enabled ? '#D1FAE5' : '#FEE2E2',
                        color: v.enabled ? '#065F46' : '#7F1D1D',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem'
                      }}>
                        {v.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {!v.approved && (
                          <>
                            <button
                              className="btn btn-sm"
                              onClick={() => approveVendor(v._id)}
                              style={{
                                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 0.8rem',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontSize: '0.85rem'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                              }}
                            >
                              ✓ Approve
                            </button>
                            <button
                              className="btn btn-sm"
                              onClick={() => rejectVendor(v._id)}
                              style={{
                                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 0.8rem',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                fontSize: '0.85rem'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                              }}
                            >
                              ✕ Reject
                            </button>
                          </>
                        )}
                        {v.approved && (
                          <button
                            className="btn btn-sm"
                            onClick={() => toggleVendor(v._id)}
                            style={{
                              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                              color: 'white',
                              border: 'none',
                              padding: '0.5rem 0.8rem',
                              borderRadius: '6px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              fontSize: '0.85rem'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            {v.enabled ? '🔒 Disable' : '🔓 Enable'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'delivery' && (
        <div>
          <h4 style={{ color: '#1E40AF', fontWeight: '700', marginBottom: '1.5rem' }}>🛵 Delivery Boys</h4>
          
          {/* Add Delivery Boy Form */}
          <form onSubmit={addDeliveryBoy} className="mb-3" style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(30, 64, 175, 0.1)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <input
                className="form-control"
                placeholder="Name"
                value={newDeliveryName}
                onChange={e => setNewDeliveryName(e.target.value)}
                required
                style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.6rem' }}
              />
              <input
                className="form-control"
                placeholder="Phone"
                value={newDeliveryPhone}
                onChange={e => setNewDeliveryPhone(e.target.value)}
                required
                style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.6rem' }}
              />
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 24px rgba(30, 64, 175, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                + Add
              </button>
            </div>
          </form>

          {/* Edit Delivery Boy Modal */}
          {editingDeliveryBoy && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                maxWidth: '500px',
                width: '90%'
              }}>
                <h5 style={{ color: '#1E40AF', marginBottom: '1rem', fontWeight: '700' }}>✏️ Edit Delivery Boy</h5>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontWeight: '600' }}>Name</label>
                  <input
                    className="form-control"
                    value={editingName}
                    onChange={e => setEditingName(e.target.value)}
                    style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.6rem' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontWeight: '600' }}>Phone</label>
                  <input
                    className="form-control"
                    value={editingPhone}
                    onChange={e => setEditingPhone(e.target.value)}
                    style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.6rem' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={saveDeliveryBoyEdit}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    💾 Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingDeliveryBoy(null);
                      setEditingName('');
                      setEditingPhone('');
                    }}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    ✕ Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Assignment Modal */}
          {assignmentModal && selectedDeliveryBoy && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflowY: 'auto'
              }}>
                <h5 style={{ color: '#1E40AF', marginBottom: '1.5rem', fontWeight: '700' }}>
                  🏪 Assign Restaurants to {selectedDeliveryBoy.name}
                </h5>
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ color: '#475569', marginBottom: '1rem', fontWeight: '600' }}>
                    Select restaurants to assign to this delivery boy:
                  </p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '1rem'
                  }}>
                    {assignableRestaurants.map(restaurant => (
                      <div
                        key={restaurant._id}
                        onClick={() => toggleRestaurantSelection(restaurant._id)}
                        style={{
                          padding: '1rem',
                          border: '2px solid ' + (selectedRestaurants.includes(restaurant._id) ? '#1E40AF' : '#CBD5E1'),
                          borderRadius: '8px',
                          cursor: 'pointer',
                          background: selectedRestaurants.includes(restaurant._id) ? '#EFF6FF' : 'white',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 64, 175, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="checkbox"
                            checked={selectedRestaurants.includes(restaurant._id)}
                            onChange={() => {}}
                            style={{
                              width: '18px',
                              height: '18px',
                              cursor: 'pointer',
                              accentColor: '#1E40AF'
                            }}
                          />
                          <div>
                            <p style={{ margin: '0.25rem 0', fontWeight: '600', color: '#1E293B' }}>
                              {restaurant.name}
                            </p>
                            <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#64748B' }}>
                              {restaurant.category}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={saveRestaurantAssignment}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    ✓ Save Assignment
                  </button>
                  <button
                    onClick={() => {
                      setAssignmentModal(false);
                      setSelectedDeliveryBoy(null);
                      setSelectedRestaurants([]);
                    }}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    ✕ Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Boys Table */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(30, 64, 175, 0.1)',
            overflowX: 'auto'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E2E8F0', background: '#EFF6FF' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1E40AF' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1E40AF' }}>Phone</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1E40AF' }}>Assigned Restaurants</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1E40AF' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deliveryBoys.map((db, idx) => (
                  <tr key={db._id} style={{
                    borderBottom: '1px solid #E2E8F0',
                    background: idx % 2 === 0 ? 'white' : '#F8FAFC'
                  }}>
                    <td style={{ padding: '1rem', color: '#1E293B', fontWeight: '500' }}>{db.name}</td>
                    <td style={{ padding: '1rem', color: '#64748B' }}>{db.phone}</td>
                    <td style={{ padding: '1rem', color: '#64748B', fontSize: '0.9rem' }}>
                      <span style={{
                        background: '#DBEAFE',
                        color: '#1E40AF',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        {db.assignedVendors ? db.assignedVendors.length : 0} restaurant(s)
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => openAssignmentModal(db)}
                          style={{
                            background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 0.8rem',
                            borderRadius: '6px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontSize: '0.85rem'
                          }}
                          title="Assign restaurants"
                        >
                          🏪 Assign
                        </button>
                        <button
                          onClick={() => editDeliveryBoy(db)}
                          style={{
                            background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 0.8rem',
                            borderRadius: '6px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontSize: '0.85rem'
                          }}
                          title="Edit delivery boy"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => deleteDeliveryBoy(db._id)}
                          style={{
                            background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 0.8rem',
                            borderRadius: '6px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontSize: '0.85rem'
                          }}
                          title="Delete delivery boy"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'banner' && (
        <div>
          <h4 style={{ color: '#1E40AF', fontWeight: '700', marginBottom: '1.5rem' }}>🖼️ Manage Banners</h4>
          <form onSubmit={uploadBanner} style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(30, 64, 175, 0.1)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <input
                className="form-control"
                placeholder="Banner Title"
                value={bannerTitle}
                onChange={e => setBannerTitle(e.target.value)}
                style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.6rem' }}
              />
              <input
                className="form-control"
                placeholder="Play Store URL (https://play.google.com/store/apps/details?id=...)"
                value={bannerPlayStoreUrl}
                onChange={e => setBannerPlayStoreUrl(e.target.value)}
                required
                style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.6rem' }}
              />
              <input
                className="form-control"
                type="file"
                onChange={e => setBannerFile(e.target.files[0])}
                required
                style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.6rem' }}
              />
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 24px rgba(30, 64, 175, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                📤 Upload
              </button>
            </div>
          </form>

          <div style={{
            marginTop: '1.5rem',
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(30, 64, 175, 0.1)'
          }}>
            <h5 style={{ color: '#1E40AF', fontWeight: '700', marginBottom: '1rem' }}>Active Banner Library ({banners.length})</h5>
            {banners.length === 0 ? (
              <p style={{ color: '#64748B', margin: 0 }}>No banners uploaded yet.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {banners.map(b => (
                  <div key={b._id} style={{ border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ height: '140px', background: '#EFF6FF' }}>
                      {b.imageUrl && (
                        <img
                          src={`${API}${b.imageUrl}`}
                          alt={b.title || 'banner'}
                          style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                        />
                      )}
                    </div>
                    <div style={{ padding: '0.85rem' }}>
                      {editingBannerId === b._id ? (
                        <>
                          <input
                            className="form-control"
                            value={editingBannerTitle}
                            onChange={e => setEditingBannerTitle(e.target.value)}
                            placeholder="Banner title"
                            style={{ marginBottom: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.55rem' }}
                          />
                          <input
                            className="form-control"
                            value={editingBannerPlayStoreUrl}
                            onChange={e => setEditingBannerPlayStoreUrl(e.target.value)}
                            placeholder="Play Store URL"
                            style={{ marginBottom: '0.5rem', borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.55rem' }}
                          />
                          <input
                            className="form-control"
                            type="file"
                            onChange={e => setEditingBannerFile(e.target.files[0])}
                            style={{ marginBottom: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.55rem' }}
                          />
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => saveBannerEdit(b._id)}
                              style={{
                                flex: 1,
                                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.5rem 0.7rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelBannerEdit}
                              style={{
                                flex: 1,
                                background: 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.5rem 0.7rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p style={{ margin: '0 0 0.4rem 0', fontWeight: '600', color: '#1E293B' }}>{b.title || 'Untitled Banner'}</p>
                          <a href={b.playStoreUrl} target="_blank" rel="noreferrer" style={{ color: '#1E40AF', fontSize: '0.85rem', wordBreak: 'break-all' }}>
                            {b.playStoreUrl || 'No Play Store URL'}
                          </a>
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem' }}>
                            <button
                              onClick={() => startBannerEdit(b)}
                              style={{
                                flex: 1,
                                background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.5rem 0.7rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteBanner(b._id)}
                              style={{
                                flex: 1,
                                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.5rem 0.7rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'central' && (
        <div>
          <h4 style={{ color: '#1E40AF', fontWeight: '700', marginBottom: '1.5rem' }}>📞 Central RocketWheel Number</h4>
          <div style={{
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            color: '#1E3A8A',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            marginBottom: '1rem',
            fontWeight: '600'
          }}>
            Current customer support number: {centralPhone || 'Not set'}
          </div>
          <form onSubmit={setCentral} style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(30, 64, 175, 0.1)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <input
                className="form-control"
                placeholder="WhatsApp Phone (e.g., 919XXXXXXXXX)"
                value={centralPhone}
                onChange={e => setCentralPhone(e.target.value)}
                required
                style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.6rem' }}
              />
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 24px rgba(30, 64, 175, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                💾 Save
              </button>
            </div>
          </form>
        </div>
      )}
      </div>
    </div>
  );
}


