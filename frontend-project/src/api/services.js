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
  getWordsOnly: (categoryId) => apiClient.get(`/categories/${categoryId}/words-only`),
  create: (data) => apiClient.post('/categories', data),
  update: (id, data) => apiClient.put(`/categories/${id}`, data),
  delete: (id) => apiClient.delete(`/categories/${id}`),
};

export const wordService = {
  getByCategory: (categoryId) => apiClient.get(`/categories/${categoryId}`),
  create: (categoryId, data) => apiClient.post(`/categories/${categoryId}/words`, data),
  delete: (id) => apiClient.delete(`/words/${id}`),
  getWordById: (id) => apiClient.get(`/words/${id}`),
  getRandomWord: () => apiClient.get('/words/random'),
};

export const gameService = {
  getAll: () => apiClient.get('/games'),
  getById: (id) => apiClient.get(`/games/${id}`),
  create: (data) => apiClient.post('/games', data),
  getRounds: (gameId) => apiClient.get(`/games/${gameId}/rounds`),
  createRound: (gameId, data) => apiClient.post(`/games/${gameId}/rounds`, data),
  update: (id, data) => apiClient.put(`/games/${id}`, data),
  delete: (id) => apiClient.delete(`/games/${id}`),
};

export const userService = {
  getProfile: () => apiClient.get('/user'),
  updateProfile: (data) => apiClient.put('/user', data),
  uploadAvatar: (formData) => 
    apiClient.post('/user/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (data) => apiClient.put('/user/password', data),
};

export const localeService = {
  setLocale: (locale) => apiClient.post('/set-locale', { locale }),
  getCurrentLocale: () => apiClient.get('/current-locale')
};

export const adminService = {
  getUsers: () => apiClient.get('/admin/users'),
  updateUserRole: (userId, data) => apiClient.put(`/admin/users/${userId}/role`, data),
  deleteUser: (userId) => apiClient.delete(`/admin/users/${userId}`),
  toggleUserStatus: (userId) => apiClient.put(`/admin/users/${userId}/toggle-status`),
  
  getAllCategories: () => apiClient.get('/admin/categories'),
  createCategory: (data) => apiClient.post('/admin/categories', data),
  updateCategory: (categoryId, data) => apiClient.put(`/admin/categories/${categoryId}`, data),
  deleteCategory: (categoryId) => apiClient.delete(`/admin/categories/${categoryId}`),
  toggleDefaultCategory: (categoryId) => apiClient.put(`/admin/categories/${categoryId}/toggle-default`),
};