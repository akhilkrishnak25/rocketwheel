const QRCode = require('qrcode');

const DEFAULT_CLIENT_ORIGIN = 'https://akhilkrishnak25.github.io/rocketwheel';

function getClientOrigin() {
  const configured = process.env.CLIENT_ORIGIN || DEFAULT_CLIENT_ORIGIN;
  return configured.replace(/\/+$/, '');
}

function getRouterMode() {
  if (process.env.CLIENT_ROUTER_MODE) return process.env.CLIENT_ROUTER_MODE;
  return getClientOrigin().includes('github.io') ? 'hash' : 'browser';
}

function buildClientUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const hashPrefix = getRouterMode() === 'hash' ? '/#' : '';
  return `${getClientOrigin()}${hashPrefix}${normalizedPath}`;
}

function buildGlobalVendorsUrl() {
  return buildClientUrl('/vendors');
}

function buildVendorMenuUrl(vendorId) {
  return buildClientUrl(`/menu/${vendorId}`);
}

async function generateQrDataUrl(url) {
  return QRCode.toDataURL(url);
}

module.exports = {
  getClientOrigin,
  getRouterMode,
  buildClientUrl,
  buildGlobalVendorsUrl,
  buildVendorMenuUrl,
  generateQrDataUrl
};
