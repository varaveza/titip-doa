import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
})

export const authService = {
  async login(username, password) {
    const response = await api.post('/api/auth/login', {
      username,
      password
    })
    return response.data
  },

  async register(username, fullName, password) {
    const response = await api.post('/api/auth/register', {
      username,
      full_name: fullName,
      password
    })
    return response.data
  },

  async checkAuth() {
    try {
      const response = await api.get('/api/auth/check')
      return response.data
    } catch (error) {
      return null
    }
  },

  async logout() {
    await api.post('/api/auth/logout')
  }
}

