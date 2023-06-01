import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import Cookies from 'js-cookie'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      config.headers['logintoken'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    console.log(response.data.code, 11)
    if (response.data.code == 1) {
        return res
    } else {
      var message = '';
      switch (response.data.code) {
        case 400: message = '请求错误(400)'; break;
        // case 401: message = '未授权,请重新登录(401)';store.dispatch('user/logout', store.getters.token); router.push('/login'); break;
        case 403: message = '没有权限, 拒绝访问(403)'; break;
        case 404: message = '请求出错(404)'; break;
        case 408: message = '请求超时(408)'; break;
        case 500: message = '服务器错误(500)'; break;
        case 501: message = '服务未实现(501)'; break;
        case 502: message = '网络错误(502)'; break;
        case 503: message = '服务不可用(503)'; break;
        case 504: message = '网络超时(504)'; break;
        case 505: message = 'HTTP版本不受支持(505)'; break;
        default: message = '连接出错('+ response.data.msg +')!';
      }
      if(response.data.code == 401 && response.data.msg != '退出成功'){
        console.log(123)
        message = '未授权,请重新登录(401)';
        store.dispatch('user/logout', store.getters.token); 
        router.push('/login')
        
        
      }
    }
  },

  error => {
    if (error.message.includes('timeout')) {
      if(error.config.serrMsg){
        Message({
          message: '请求超时，请重新操作',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(error)
    }
    if(error.config.serrMsg){
      Message({
        message: message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
