import axios from 'axios'
import { UNAUTHORIZED } from './http-status-code'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
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
    return response
  },
  async (error) => {
    NProgress.done()
    const accessToken = localStorage.getItem('access_token')
    if (error.status === UNAUTHORIZED && accessToken) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error.response)
  }
)

export default api
