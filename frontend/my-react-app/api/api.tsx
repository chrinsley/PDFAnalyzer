import axios from 'axios'

const API = 'http://localhost:8000/'

let isRefreshing = false
let failedQueue: Array<{ resolve: (value: string) => void; reject: (reason?: unknown) => void }> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token as string)
    }
  })

  failedQueue = []
}

export const instance = axios.create({
  baseURL: API,
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }

  return config
})

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/signin'
        return Promise.reject(error)
      }

      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return instance(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      isRefreshing = true

      try {
        const response = await axios.post(`${API}api/token/refresh/`, {
          refresh: refreshToken,
        })

        const newAccessToken = response.data.access
        localStorage.setItem('token', newAccessToken)
        processQueue(null, newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return instance(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/signin'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

