import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from '../config/api';

function resolveImageSrc(imageUrl) {
  if (!imageUrl) return '';
  return /^https?:\/\//i.test(imageUrl) ? imageUrl : `${API}${imageUrl}`;
}

export default function VendorDashboard({ token, vendorId, onLogout }) {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [vendor, setVendor] = useState(null);
  const [vendorForm, setVendorForm] = useState({ name: '', category: '', address: '', phone: '' });
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [editingProductId, setEditingProductId] = useState('');
  const [editProduct, setEditProduct] = useState({ name: '', price: '', category: '', imageUrl: '' });
  const [vendorPhoto, setVendorPhoto] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [bulkImageFiles, setBulkImageFiles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadVendor();
    if (tab === 'products') loadProducts();
  }, [tab]);

  const config = { headers: { Authorization: `Bearer ${token}` } };

  async function loadVendor() {
    try {
      const res = await axios.get(`${API}/api/vendor/${vendorId}/info`, config);
      setVendor(res.data);
      setVendorForm({
        name: res.data.name || '',
        category: res.data.category || '',
        address: res.data.address || '',
        phone: res.data.phone || ''
      });
    } catch (err) {
      setError('Failed to load vendor info');
    }
  }

  async function loadProducts() {
    try {
      const res = await axios.get(`${API}/api/vendor/${vendorId}/products`, config);
      setProducts(res.data);
    } catch (err) {
      setError('Failed to load products');
    }
  }

  async function addProduct(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', productPrice);
    const normalizedCategory = productCategory.trim();
    if (normalizedCategory) formData.append('category', normalizedCategory);
    if (productImage) formData.append('image', productImage);
    try {
      await axios.post(`${API}/api/vendor/${vendorId}/products`, formData, { ...config, headers: { ...config.headers, 'Content-Type': 'multipart/form-data' } });
      setSuccess('Product added!');
      setError('');
      setProductName('');
      setProductPrice('');
      setProductCategory('');
      setProductImage(null);
      loadProducts();
    } catch (err) {
      setError('Failed to add product');
    }
  }

  async function uploadExcel(e) {
    e.preventDefault();
    if (!excelFile) {
      setError('Please select a file');
      return;
    }
    const formData = new FormData();
    formData.append('file', excelFile);
    bulkImageFiles.forEach((img) => formData.append('images', img));
    try {
      const res = await axios.post(`${API}/api/vendor/${vendorId}/products/upload-xlsx`, formData, { ...config, headers: { ...config.headers, 'Content-Type': 'multipart/form-data' } });
      const createdCount = res?.data?.createdCount ?? 0;
      const skippedCount = res?.data?.skippedCount ?? 0;
      setSuccess(`Products uploaded! Added ${createdCount} item(s).${skippedCount ? ` Skipped ${skippedCount} invalid row(s).` : ''}`);
      setError('');
      setExcelFile(null);
      setBulkImageFiles([]);
      loadProducts();
    } catch (err) {
      const message = err?.response?.data?.error || err?.message || 'Failed to upload file';
      setError(message);
      setSuccess('');
    }
  }

  async function downloadQR() {
    try {
      let qrDataUrl = '';

      try {
        const res = await axios.get(`${API}/api/public/qr/vendor-direct/${vendorId}?t=${Date.now()}`);
        qrDataUrl = res?.data?.dataUrl || '';
      } catch (primaryErr) {
        // Fallback: generate QR image via public API if backend route is not deployed yet.
        const clientMenuUrl = `${window.location.origin}${window.location.pathname}#/menu/${vendorId}`;
        qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(clientMenuUrl)}`;
      }

      const link = document.createElement('a');
      link.href = qrDataUrl;
      link.download = `vendor-qr-${vendorId}.png`;
      link.click();
    } catch (err) {
      setError('Failed to download QR');
    }
  }

  async function uploadVendorPhoto(e) {
    e.preventDefault();
    if (!vendorPhoto) {
      setError('Please select a photo');
      return;
    }
    const formData = new FormData();
    formData.append('photo', vendorPhoto);
    try {
      await axios.post(`${API}/api/vendor/${vendorId}/photo`, formData, { ...config, headers: { ...config.headers, 'Content-Type': 'multipart/form-data' } });
      setSuccess('Restaurant photo updated successfully!');
      setError('');
      setVendorPhoto(null);
      loadVendor();
    } catch (err) {
      setError('Failed to upload photo');
    }
  }

  function startProductEdit(product) {
    setEditingProductId(product._id);
    setEditProduct({
      name: product.name || '',
      price: String(product.price ?? ''),
      category: product.category || '',
      imageUrl: product.imageUrl || ''
    });
    setError('');
    setSuccess('');
  }

  function cancelProductEdit() {
    setEditingProductId('');
    setEditProduct({ name: '', price: '', category: '', imageUrl: '' });
  }

  async function saveProductEdit(productId) {
    if (!editProduct.name.trim()) {
      setError('Product name is required');
      return;
    }

    if (!editProduct.price || Number(editProduct.price) <= 0) {
      setError('Please enter a valid product price');
      return;
    }

    try {
      await axios.put(`${API}/api/vendor/${vendorId}/products/${productId}`, {
        name: editProduct.name.trim(),
        price: Number(editProduct.price),
        category: editProduct.category.trim(),
        imageUrl: editProduct.imageUrl.trim()
      }, config);
      setSuccess('Product updated successfully!');
      setError('');
      cancelProductEdit();
      loadProducts();
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to update product');
      setSuccess('');
    }
  }

  async function deleteProduct(productId) {
    const shouldDelete = window.confirm('Delete this product?');
    if (!shouldDelete) return;

    try {
      await axios.delete(`${API}/api/vendor/${vendorId}/products/${productId}`, config);
      setSuccess('Product deleted successfully!');
      setError('');
      if (editingProductId === productId) cancelProductEdit();
      loadProducts();
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to delete product');
      setSuccess('');
    }
  }

  function exportProducts() {
    if (products.length === 0) {
      setError('No products to export');
      return;
    }

    try {
      // Create CSV header
      const headers = ['Name', 'Price', 'Category', 'ImageUrl'];
      
      // Create CSV rows
      const rows = products.map(p => [
        `"${(p.name || '').replace(/"/g, '""')}"`,
        p.price || '',
        `"${(p.category || '').replace(/"/g, '""')}"`,
        `"${(p.imageUrl || '').replace(/"/g, '""')}"`
      ]);

      // Combine header and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `products-${vendor.name}-${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccess('Products exported successfully!');
      setError('');
    } catch (err) {
      setError('Failed to export products');
    }
  }

  function downloadTemplate() {
    try {
      // Create template with sample data
      const headers = ['Name', 'Price', 'Category', 'ImageUrl', 'ImageFile'];
      const sampleRows = [
        ['"Biryani"', '250', '"Biryani"', '"/uploads/products/biryani.jpg"', '""'],
        ['"Dosa"', '120', '"Dosa"', '"https://example.com/dosa.jpg"', '""'],
        ['"Samosa"', '50', '"Snacks"', '""', '"samosa.jpg"'],
        ['"Chai"', '20', '"Beverages"', '""', '"chai.png"']
      ];

      const csvContent = [
        headers.join(','),
        ...sampleRows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `products-template-${new Date().getTime()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccess('Template downloaded! Edit it and upload to bulk add products.');
      setError('');
    } catch (err) {
      setError('Failed to download template');
    }
  }

  async function updateVendorDetails(e) {
    e.preventDefault();
    if (!vendorForm.name.trim() || !vendorForm.category.trim()) {
      setError('Name and category are required');
      return;
    }

    try {
      const res = await axios.put(`${API}/api/vendor/${vendorId}/info`, {
        name: vendorForm.name.trim(),
        category: vendorForm.category.trim(),
        address: vendorForm.address.trim(),
        phone: vendorForm.phone.trim()
      }, config);
      setVendor(res.data.vendor);
      setSuccess('Restaurant details updated successfully!');
      setError('');
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to update details');
      setSuccess('');
    }
  }

  if (!vendor) return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)'
    }}>
      <div style={{
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '2rem',
          marginBottom: '1rem'
        }}>⏳</div>
        <p style={{ color: '#1E40AF', fontWeight: '600' }}>Loading vendor information...</p>
      </div>
    </div>
  );

  const uniqueProductCategories = [...new Set(products.map((p) => (p.category || '').trim()).filter(Boolean))];
  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(productSearchQuery.toLowerCase()))
    .filter((p) => selectedProductCategory === '' || (p.category || '').trim() === selectedProductCategory);

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
          <div>
            <h2 style={{ margin: 0, fontWeight: '700', fontSize: '1.8rem' }}>📍 {vendor.name}</h2>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '0.95rem' }}>
              {vendor.category} | {vendor.address}
            </p>
          </div>
          <button
            className="btn btn-danger"
            onClick={() => { onLogout(); navigate('/vendor/login'); }}
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
          {['products', 'bulk', 'qr', 'settings'].map(t => (
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
              {t === 'products' && '📦 Products'}
              {t === 'bulk' && '📤 Bulk Upload'}
              {t === 'qr' && '📱 QR Code'}
              {t === 'settings' && '🏪 Restaurant'}
            </button>
          ))}
        </div>

      {tab === 'products' && (
        <div>
          <h4 style={{ color: '#1E40AF', fontWeight: '700', marginBottom: '1.5rem' }}>📦 Add Product</h4>
          <form onSubmit={addProduct} style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(30, 64, 175, 0.1)',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <input
                className="form-control"
                placeholder="Product Name"
                value={productName}
                onChange={e => setProductName(e.target.value)}
                required
                style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.6rem' }}
              />
              <input
                className="form-control"
                type="number"
                placeholder="Price (₹)"
                value={productPrice}
                onChange={e => setProductPrice(e.target.value)}
                required
                style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.6rem' }}
              />
              <input
                className="form-control"
                placeholder="Category (optional)"
                value={productCategory}
                onChange={e => setProductCategory(e.target.value)}
                style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.6rem' }}
              />
              <input
                className="form-control"
                type="file"
                onChange={e => setProductImage(e.target.files[0])}
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
                + Add Product
              </button>
            </div>
          </form>

          <h4 style={{ color: '#1E40AF', fontWeight: '700', marginBottom: '1.5rem' }}>Your Products</h4>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(30, 64, 175, 0.1)',
            padding: '1rem',
            marginBottom: '1rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem'
          }}>
            <input
              className="form-control"
              placeholder="Search product name..."
              value={productSearchQuery}
              onChange={(e) => setProductSearchQuery(e.target.value)}
              style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.6rem' }}
            />
            <select
              className="form-control"
              value={selectedProductCategory}
              onChange={(e) => setSelectedProductCategory(e.target.value)}
              style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.6rem' }}
            >
              <option value="">All categories</option>
              {uniqueProductCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          {products.length > 0 && (
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={exportProducts}
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                📥 Export as CSV
              </button>
            </div>
          )}
          
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
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1E40AF' }}>Price</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1E40AF' }}>Category</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1E40AF' }}>Image</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1E40AF' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
                      {products.length === 0 ? 'No products added yet. Add one above!' : 'No products match the selected filters.'}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p, idx) => (
                    <tr key={p._id} style={{
                      borderBottom: '1px solid #E2E8F0',
                      background: idx % 2 === 0 ? 'white' : '#F8FAFC'
                    }}>
                      <td style={{ padding: '1rem', color: '#1E293B', fontWeight: '500' }}>
                        {editingProductId === p._id ? (
                          <input
                            className="form-control"
                            value={editProduct.name}
                            onChange={(e) => setEditProduct(prev => ({ ...prev, name: e.target.value }))}
                            style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.5rem' }}
                          />
                        ) : (
                          p.name
                        )}
                      </td>
                      <td style={{ padding: '1rem', color: '#1E40AF', fontWeight: '600' }}>
                        {editingProductId === p._id ? (
                          <input
                            className="form-control"
                            type="number"
                            min="1"
                            value={editProduct.price}
                            onChange={(e) => setEditProduct(prev => ({ ...prev, price: e.target.value }))}
                            style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.5rem', maxWidth: '120px' }}
                          />
                        ) : (
                          `₹${p.price}`
                        )}
                      </td>
                      <td style={{ padding: '1rem', color: '#64748B', fontSize: '0.9rem' }}>
                        {editingProductId === p._id ? (
                          <input
                            className="form-control"
                            value={editProduct.category}
                            onChange={(e) => setEditProduct(prev => ({ ...prev, category: e.target.value }))}
                            placeholder="Category"
                            style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.5rem' }}
                          />
                        ) : (
                          (p.category || '').trim() || <span style={{ color: '#CBD5E1' }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {editingProductId === p._id ? (
                          <input
                            className="form-control"
                            value={editProduct.imageUrl}
                            onChange={(e) => setEditProduct(prev => ({ ...prev, imageUrl: e.target.value }))}
                            placeholder="https://... or /uploads/..."
                            style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.5rem' }}
                          />
                        ) : (
                          p.imageUrl ? (
                            <img src={resolveImageSrc(p.imageUrl)} alt="" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>No image</span>
                          )
                        )}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {editingProductId === p._id ? (
                            <>
                              <button
                                type="button"
                                onClick={() => saveProductEdit(p._id)}
                                style={{
                                  background: '#16A34A',
                                  color: 'white',
                                  border: 'none',
                                  padding: '0.4rem 0.8rem',
                                  borderRadius: '8px',
                                  fontWeight: '600',
                                  cursor: 'pointer'
                                }}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={cancelProductEdit}
                                style={{
                                  background: '#64748B',
                                  color: 'white',
                                  border: 'none',
                                  padding: '0.4rem 0.8rem',
                                  borderRadius: '8px',
                                  fontWeight: '600',
                                  cursor: 'pointer'
                                }}
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => startProductEdit(p)}
                                style={{
                                  background: '#1E40AF',
                                  color: 'white',
                                  border: 'none',
                                  padding: '0.4rem 0.8rem',
                                  borderRadius: '8px',
                                  fontWeight: '600',
                                  cursor: 'pointer'
                                }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteProduct(p._id)}
                                style={{
                                  background: '#DC2626',
                                  color: 'white',
                                  border: 'none',
                                  padding: '0.4rem 0.8rem',
                                  borderRadius: '8px',
                                  fontWeight: '600',
                                  cursor: 'pointer'
                                }}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'bulk' && (
        <div>
          <h4 style={{ color: '#1E40AF', fontWeight: '700', marginBottom: '1.5rem' }}>📤 Bulk Upload via Excel</h4>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(30, 64, 175, 0.1)',
            marginBottom: '2rem'
          }}>
            <p style={{ color: '#64748B', marginBottom: '1rem', fontSize: '0.95rem' }}>
              📋 Excel format: Required columns: <strong>Name</strong>, <strong>Price</strong>. Optional columns: <strong>Category</strong>, <strong>Image/ImageUrl</strong> (full URL or /uploads path), <strong>ImageFile</strong> (for local image uploads).
            </p>
            <p style={{ color: '#94A3B8', marginBottom: '1rem', fontSize: '0.85rem' }}>
              Example header row: Name | Price | Category | ImageUrl | ImageFile
            </p>
            <p style={{ color: '#64748B', marginBottom: '1rem', fontSize: '0.85rem' }}>
              If using local files, upload images below and set <strong>ImageFile</strong> in sheet to exact file name (example: <strong>samosa.jpg</strong>).
            </p>
            <div style={{ marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={downloadTemplate}
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 24px rgba(139, 92, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                📋 Download Template
              </button>
            </div>
            <form onSubmit={uploadExcel}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <input
                  className="form-control"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={e => setExcelFile(e.target.files[0])}
                  required
                  style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.6rem' }}
                />
                <input
                  className="form-control"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e => setBulkImageFiles(Array.from(e.target.files || []))}
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
                  🚀 Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {tab === 'qr' && (
        <div>
          <h4 style={{ color: '#1E40AF', fontWeight: '700', marginBottom: '1.5rem' }}>📱 Your QR Code</h4>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(30, 64, 175, 0.1)',
            textAlign: 'center'
          }}>
            <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              📲 Share this QR code to let customers scan and order from your menu.
            </p>
            <button
              onClick={downloadQR}
              style={{
                background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
                color: 'white',
                border: 'none',
                padding: '0.8rem 2rem',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '1rem'
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
              ⬇️ Download QR Code
            </button>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div>
          <h4 style={{ color: '#1E40AF', fontWeight: '700', marginBottom: '1.5rem' }}>🏪 Restaurant Photo & Details</h4>
          
          {/* Restaurant Photo Section */}
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(30, 64, 175, 0.1)',
            marginBottom: '2rem'
          }}>
            <h5 style={{ color: '#1E40AF', fontWeight: '600', marginBottom: '1rem' }}>📸 Restaurant Photo</h5>
            
            {vendor.photo && (
              <div style={{
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Current Photo:</p>
                <img 
                  src={`${API}${vendor.photo}`} 
                  alt="Restaurant" 
                  style={{
                    maxWidth: '300px',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    boxShadow: '0 4px 12px rgba(30, 64, 175, 0.15)',
                    border: '2px solid #EFF6FF'
                  }}
                />
              </div>
            )}
            
            <form onSubmit={uploadVendorPhoto} style={{
              background: '#F8FAFC',
              padding: '1.5rem',
              borderRadius: '10px',
              border: '2px dashed #CBD5E1'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
                <input
                  className="form-control"
                  type="file"
                  accept="image/*"
                  onChange={e => setVendorPhoto(e.target.files[0])}
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
                  🚀 Upload Photo
                </button>
              </div>
              <p style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '0.8rem', marginBottom: 0 }}>
                💡 Supported formats: JPG, PNG, GIF. Max size: 5MB. Recommended size: 800x600px
              </p>
            </form>
          </div>

          {/* Restaurant Details Section */}
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(30, 64, 175, 0.1)'
          }}>
            <h5 style={{ color: '#1E40AF', fontWeight: '600', marginBottom: '1rem' }}>📋 Details</h5>
            <form onSubmit={updateVendorDetails}>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div>
                <label style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
                  Name
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={vendorForm.name}
                  onChange={(e) => setVendorForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.6rem' }}
                />
              </div>
              
              <div>
                <label style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
                  Category
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={vendorForm.category}
                  onChange={(e) => setVendorForm(prev => ({ ...prev, category: e.target.value }))}
                  required
                  style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.6rem' }}
                />
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <label style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
                  Address
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={vendorForm.address}
                  onChange={(e) => setVendorForm(prev => ({ ...prev, address: e.target.value }))}
                  style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.6rem' }}
                />
              </div>
              
              <div>
                <label style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
                  Phone
                </label>
                <input
                  className="form-control"
                  type="text"
                  value={vendorForm.phone}
                  onChange={(e) => setVendorForm(prev => ({ ...prev, phone: e.target.value }))}
                  style={{ borderRadius: '8px', border: '1px solid #CBD5E1', padding: '0.6rem' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1.4rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Save Details
              </button>
            </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}


