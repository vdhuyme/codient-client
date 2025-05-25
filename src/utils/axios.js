import axios from 'axios'
import { UNAUTHORIZED } from './http-status-code'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { config } from './config'

const api = axios.create({
  baseURL: config.baseUrl
})

api.interceptors.request.use(
  (config) => {
    NProgress.start()

    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    NProgress.done()
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    NProgress.done()
    return response.data
  },
  async (error) => {
    NProgress.done()

    const originalRequest = error.config

    if (error.response?.status === UNAUTHORIZED && !originalRequest._retry && localStorage.getItem('refresh_token')) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('refresh_token')

        const response = await axios.post(`${config.baseUrl}/auth/refresh-token`, { refreshToken })
        const refreshAccessToken = response.data.data

        localStorage.setItem('access_token', refreshAccessToken)
        api.defaults.headers.common['Authorization'] = `Bearer ${refreshAccessToken}`

        return api(originalRequest)
      } catch (err) {
        console.error('Token refresh failed:', err)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')

        setTimeout(() => {
          window.location.href = '/login'
        }, 500)

        return Promise.reject(err)
      }
    }

    return Promise.reject(error.response)
  }
)

export default api
