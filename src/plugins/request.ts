/*
 * @Description:
 * @Author: lanchao
 * @Date: 2022-01-12 15:18:22
 * @LastEditTime: 2022-01-20 14:21:00
 * @LastEditors: lanchao
 * @Reference:
 */
import axios from 'axios'
const service = axios.create({
  baseURL: '', // 此处写死时无法兼容不同api地址， 地址固定一个 这里可写死
  timeout: 5000
  // withCredentials: true // send cookies when cross-domain requests
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    // if (UserModule.token) {
    //   config.headers.Authorization = UserModule.token
    // }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.statusCode !== 1000) {
      console.error('错误')
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  (error) => {
    console.error('错误')
    return Promise.reject(error)
  }
)

export default service
