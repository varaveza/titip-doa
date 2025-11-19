import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
})

export const prayerService = {
  async submitPrayer(userId, senderName, message) {
    const response = await api.post('/api/prayer/submit', {
      user_id: userId,
      sender_name: senderName,
      message: message
    })
    return response.data
  },

  async getPrayers(tab = 'unread') {
    const response = await api.get('/api/prayer', {
      params: { tab }
    })
    return response.data
  },

  async markAsRead(prayerId) {
    const response = await api.post('/api/prayer/mark-read', {
      prayer_id: prayerId
    })
    return response.data
  }
}

