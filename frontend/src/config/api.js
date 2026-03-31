const EXPLICIT_API_URL = (process.env.REACT_APP_API_URL || '').trim();
const DEFAULT_LOCAL_API_URL = 'http://localhost:4000';
const DEFAULT_PRODUCTION_API_URL = 'https://rocketwheel.onrender.com';

function normalizeBaseUrl(url) {
  return url.replace(/\/$/, '');
}

function isGitHubPagesHost() {
  if (typeof window === 'undefined' || !window.location) return false;
  return /github\.io$/i.test(window.location.hostname);
}

function isLocalRuntimeHost() {
  if (typeof window === 'undefined' || !window.location) return false;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1';
}

function isLocalhostUrl(url) {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalizeBaseUrl(url));
}

function resolveApiBaseUrl() {
  if (isLocalRuntimeHost()) {
    return EXPLICIT_API_URL || DEFAULT_LOCAL_API_URL;
  }

  if (EXPLICIT_API_URL && !isLocalhostUrl(EXPLICIT_API_URL)) {
    return EXPLICIT_API_URL;
  }

  if (isGitHubPagesHost()) {
    return DEFAULT_PRODUCTION_API_URL;
  }

  return DEFAULT_PRODUCTION_API_URL;
}

const API_BASE_URL = normalizeBaseUrl(resolveApiBaseUrl());

export default API_BASE_URL;