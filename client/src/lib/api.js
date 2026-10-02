const API_BASE_URL = import.meta.env.API_URL || 'http://localhost:4000';

export function getStoredToken() {
  return localStorage.getItem('site_diary_token');
}

export function setStoredToken(token) {
  localStorage.setItem('site_diary_token', token);
}

export function clearStoredToken() {
  localStorage.removeItem('site_diary_token');
}

export async function apiRequest(path, options = {}) {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'string' ? payload : payload?.message || 'Request failed';
    throw new Error(message);
  }

  return payload;
}
