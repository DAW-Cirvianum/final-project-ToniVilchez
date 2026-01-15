import apiClient from "./api";

export const authService = {
  register: (data) => apiClient.post('/register', data),
  login: (login, password) => apiClient.post('/login', { login, password }),
  logout: () => apiClient.post('/logout'),
  forgotPassword: (email) => apiClient.post('/forgot-password', { email }),
  resetPassword: (email, token, password, passwordConfirmation) => 
    apiClient.post('/reset-password', { email, token, password, password_confirmation: passwordConfirmation }),
};


export const categoryService = {
  getAll: () => apiClient.get('/categories'),
  getById: (id) => apiClient.get(`/categories/${id}`),
  create: (data) => apiClient.post('/categories', data),
  update: (id, data) => apiClient.put(`/categories/${id}`, data),
  delete: (id) => apiClient.delete(`/categories/${id}`),
};


export const wordService = {
  getByCategory: (categoryId) => apiClient.get(`/categories/${categoryId}`),
  create: (categoryId, data) => apiClient.post(`/categories/${categoryId}/words`, data),
  delete: (id) => apiClient.delete(`/words/${id}`),
};

export const gameService = {
  getAll: () => apiClient.get('/games'),
  getById: (id) => apiClient.get(`/games/${id}`),
  create: (data) => apiClient.post('/games', data),
  getRounds: (gameId) => apiClient.get(`/games/${gameId}/rounds`),
  createRound: (gameId, data) => apiClient.post(`/games/${gameId}/rounds`, data),
};


export const userService = {
  getProfile: () => apiClient.get('/user'),
  updateProfile: (data) => apiClient.put('/user', data),
  uploadAvatar: (formData) => 
    apiClient.post('/user/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (data) => apiClient.put('/user/password', data),
};
