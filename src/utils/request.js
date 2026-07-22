import axios from 'axios'
import { Message } from 'element-ui'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
})

service.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

service.interceptors.response.use(
  (response) => response.data,
  (error) => {
    Message.error(error.message || '请求失败')
    return Promise.reject(error)
  }
)

export default service
