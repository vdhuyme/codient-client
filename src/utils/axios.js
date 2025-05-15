import axios from 'axios'
import { UNAUTHORIZED } from './http-status-code'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

const accessToken = localStorage.getItem('access_token')

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (error.status === UNAUTHORIZED && accessToken) {
      window.location.href = '/login'
    }
    return Promise.reject(error.response)
  }
)

export default api
