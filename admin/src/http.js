import axios from "axios"
import Vue from "vue"
import router from "./router"
import { MessageBox, Message } from 'element-ui'
import {getToken} from "./utils/auth"

const http=axios.create({
  baseURL: 'http://localhost:3000/admin/api',
  timeout:5000
})

http.interceptors.request.use(function (config) {
  console.log("http",config,getToken());
  // Do something before request is sent
  if (getToken()) {
    config.headers.Authorization = 'Admin ' + getToken()
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
})

http.interceptors.response.use(res => {
  return res.data
}, err => {
  console.log("error:",err);
  if (err.response.data.message) {
    Message({
      message: err.response.data.message,
      type: 'error',
      duration: 5 * 1000
    })

    if (err.response.status === 401) {
      router.push('/login')
    }
  }

  return Promise.reject(err)
})

export default http
