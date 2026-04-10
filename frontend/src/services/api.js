// Base API client
const API_BASE = '/api/v1';

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    // For NO CONTENT responses
    if (response.status === 204) return null;
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export const api = {
  get: (endpoint) => fetchAPI(endpoint),
  post: (endpoint, body) => fetchAPI(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => fetchAPI(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => fetchAPI(endpoint, { method: 'DELETE' }),
};
