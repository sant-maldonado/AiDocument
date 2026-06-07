import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export function authAPI() {
  return {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
  };
}

export function documentsAPI() {
  return {
    upload: (formData) =>
      api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    list: () => api.get('/documents'),
    delete: (id) => api.delete(`/documents/${id}`),
  };
}

export function chatAPI() {
  return {
    conversations: (documentId) =>
      api.get('/chat/conversations', { params: { documentId } }),
    getConversation: (id) => api.get(`/chat/conversations/${id}`),
    deleteConversation: (id) => api.delete(`/chat/conversations/${id}`),
  };
}

export default api;
