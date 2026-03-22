import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function VendorCart() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [cart, setCart] = useState([]);
  const [cust, setCust] = useState({ name: '', phone: '', address: '' });
  const [supportPhone, setSupportPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [checkout, setCheckout] = useState(false);

  const cartStorageKey = `rw_cart_${vendorId}`;
  const customerStorageKey = `rw_customer_${vendorId}`;

  useEffect(() => {
    axios.get(`${API}/api/public/vendors/${vendorId}`)
      .then((res) => {
        setVendor(res.data.vendor);
        const centralSupportPhone = res.data.centralSupportPhone || process.env.REACT_APP_CENTRAL_PHONE || '';
        setSupportPhone(centralSupportPhone);
        setWhatsappNumber(res.data.vendor?.assignedDeliveryPhone || centralSupportPhone || '');
      })
      .catch((err) => {
        console.error('Error loading vendor:', err);
        alert('Failed to load vendor details. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [vendorId]);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(cartStorageKey);
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) setCart(parsedCart);
      }

      const storedCustomer = localStorage.getItem(customerStorageKey);
      if (storedCustomer) {
        const parsedCustomer = JSON.parse(storedCustomer);
        if (parsedCustomer && typeof parsedCustomer === 'object') {
          setCust({
            name: parsedCustomer.name || '',
            phone: parsedCustomer.phone || '',
            address: parsedCustomer.address || ''
          });
        }
      }
    } catch (err) {
      console.warn('Failed to restore cart data', err);
    }
  }, [cartStorageKey, customerStorageKey]);

  useEffect(() => {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }, [cart, cartStorageKey]);

  useEffect(() => {
    localStorage.setItem(customerStorageKey, JSON.stringify(cust));
  }, [cust, customerStorageKey]);

  function removeFromCart(id) {
    setCart(cart.filter((c) => c._id !== id));
  }

  function updateQty(id, newQty) {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(cart.map((c) => (c._id === id ? { ...c, qty: newQty } : c)));
  }

  function buildMessage() {
    const itemsText = cart
      .map((i) => `- ${i.name} x${i.qty} = ₹${i.price} x ${i.qty} = ₹${i.price * i.qty}`)
      .join('\n');
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const orderId = `RW${Date.now().toString().slice(-5)}`;

    const msg = `Hello RocketWheel,

New Delivery Order:

Order ID: ${orderId}

Vendor: ${vendor?.name || ''}

Items:
${itemsText}

Total Amount: ₹${total}

Pickup Location: ${vendor?.address || vendor?.name || ''}

Customer Name: ${cust.name}
Phone: ${cust.phone}
Delivery Address: ${cust.address}

Note: Restaurant is not notified. Please handle pickup and delivery.

Please confirm delivery.`;

    return encodeURIComponent(msg);
  }

  async function placeOrder() {
    if (!whatsappNumber) {
      alert('No RocketWheel delivery number available. Please contact support.');
      return;
    }

    try {
      setCheckout(true);
      const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
      const items = cart.map((i) => ({ product: i.name, qty: i.qty, price: i.price }));

      await axios.post(`${API}/api/public/orders`, {
        vendorId,
        items,
        totalAmount: total,
        customerName: cust.name,
        customerPhone: cust.phone,
        customerAddress: cust.address
      });

      const encoded = buildMessage();
      const link = `https://api.whatsapp.com/send?phone=${whatsappNumber || supportPhone}&text=${encoded}`;
      window.open(link, '_blank');

      setCart([]);
      setCust({ name: '', phone: '', address: '' });
      localStorage.removeItem(cartStorageKey);
      localStorage.removeItem(customerStorageKey);
      alert('Order placed successfully!');
      navigate(`/menu/${vendorId}`);
    } catch (err) {
      console.error('Order failed:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setCheckout(false);
    }
  }

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <p style={{ color: '#1E40AF', fontWeight: '600' }}>Loading cart...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)' }}>
      <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #1A3A8A 50%, #3B82F6 100%)', color: 'white', padding: '1rem 0' }}>
        <div className="container d-flex flex-between align-items-center">
          <button
            onClick={() => navigate(`/menu/${vendorId}`)}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            ← Menu
          </button>
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>🛒 Cart</h2>
          <div style={{ width: '80px' }}></div>
        </div>
      </div>

      <div className="container p-4" style={{ maxWidth: '900px' }}>
        <div className="card shadow-lg border-0 rounded-lg">
          <div className="card-header" style={{ background: '#EFF6FF', padding: '1rem 1.25rem' }}>
            <h5 style={{ margin: 0, color: '#1E40AF', fontWeight: '700' }}>{vendor?.name || 'Restaurant'} · {totalItems} item(s)</h5>
          </div>

          <div className="card-body" style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <p style={{ color: '#64748B' }}>Your cart is empty.</p>
                <button
                  onClick={() => navigate(`/menu/${vendorId}`)}
                  className="btn"
                  style={{ background: '#1E40AF', color: 'white', borderRadius: '8px', border: 'none', padding: '0.6rem 1rem' }}
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item._id} style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '0.9rem', marginBottom: '0.9rem' }}>
                  <div className="d-flex flex-between align-items-start">
                    <div>
                      <div style={{ fontWeight: '600', color: '#1E293B' }}>{item.name}</div>
                      <small style={{ color: '#64748B' }}>₹{item.price} each</small>
                    </div>
                    <button onClick={() => removeFromCart(item._id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
                  </div>

                  <div className="d-flex align-items-center mt-2" style={{ gap: '0.5rem' }}>
                    <button onClick={() => updateQty(item._id, item.qty - 1)} style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1px solid #CBD5E1', background: 'white', cursor: 'pointer' }}>−</button>
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => updateQty(item._id, parseInt(e.target.value, 10) || 1)}
                      style={{ width: '55px', borderRadius: '7px', border: '1px solid #CBD5E1', textAlign: 'center', height: '30px' }}
                    />
                    <button onClick={() => updateQty(item._id, item.qty + 1)} style={{ width: '30px', height: '30px', borderRadius: '7px', border: '1px solid #CBD5E1', background: 'white', cursor: 'pointer' }}>+</button>
                    <div style={{ marginLeft: 'auto', color: '#1E40AF', fontWeight: '700' }}>₹{item.price * item.qty}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <>
              <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #E2E8F0' }}>
                <div className="d-flex flex-between align-items-center">
                  <span style={{ color: '#64748B' }}>Subtotal</span>
                  <span style={{ color: '#1E40AF', fontWeight: '700', fontSize: '1.1rem' }}>₹{total}</span>
                </div>
              </div>

              <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #E2E8F0' }}>
                <h6 style={{ marginBottom: '0.75rem', color: '#1E293B', fontWeight: '600' }}>Delivery Details</h6>
                <div className="form-group mb-2">
                  <input className="form-control" placeholder="Your Name" value={cust.name} onChange={(e) => setCust({ ...cust, name: e.target.value })} />
                </div>
                <div className="form-group mb-2">
                  <input className="form-control" placeholder="Phone Number" value={cust.phone} onChange={(e) => setCust({ ...cust, phone: e.target.value })} />
                </div>
                <div className="form-group mb-3">
                  <textarea className="form-control" placeholder="Delivery Address" value={cust.address} onChange={(e) => setCust({ ...cust, address: e.target.value })} rows={3} />
                </div>

                <button
                  onClick={placeOrder}
                  disabled={!cust.name || !cust.phone || !cust.address || checkout}
                  className="btn w-100"
                  style={{
                    background: (!cust.name || !cust.phone || !cust.address) ? '#CBD5E1' : 'linear-gradient(135deg, #1E40AF 0%, #1A3A8A 50%, #3B82F6 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    fontWeight: '700'
                  }}
                >
                  {checkout ? 'Processing...' : '🚀 Order via RocketWheel Delivery'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
