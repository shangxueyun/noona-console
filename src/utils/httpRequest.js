import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import JSONbig from 'json-bigint'
import qs from 'qs'
import merge from 'lodash/merge'

import ElementUI from 'element-ui'

// 导出
export function exportFun(url, param) {
  alert(url)
  const p = {
    token: Vue.cookie.get('token'),
    params: param
  }
  const element = document.createElement('iframe')
  element.hidden = true
  element.onload = function() {
    document.body.removeChild(element)
  }
  // element.src= exportUrl + "?"+Qs.stringify(p);
  element.src = getUrl() + url + '?json=' + encodeURI(JSON.stringify(p))
  document.body.appendChild(element)
}
export function getUrl() {
  // return `http://${window.location.hostname}:9801/`
  return 'http://192.168.50.21:8001/'
}
const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;',
    'Authorization': 'tXWFGKCbrq6jJAmO'
  },
  transformResponse: [function (data) {
    // Do whatever you want to transform the data
    return JSONbig.parse(data)
  }],
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  let data = {
    status: response.status,
    code: response.data.code,
    data: response.data.data ? response.data.data : response.data
  }
  if (response.data.code == 20000) {
    return data
  } else {
    data.msg = response.data.msg
    return data
  }
}, error => {
  return Promise.reject(error)
})

export function clearLoginInfo() {
  Vue.cookie.delete('token')
}
/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName, proxyTable = '/ms-media') => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? proxyTable : proxyTable) + actionName
}

http.LogUrl = (actionName, proxyTable = '/login') => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? proxyTable : proxyTable) + actionName
}
// 活動接口
http.activityUrl = (actionName, proxyTable = '/activity') => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? proxyTable : proxyTable) + actionName
}
// 支付
http.payUrl = (actionName, proxyTable = '/payApi') => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? proxyTable : proxyTable) + actionName
}
// 图片上传接口
http.ImgUrl = (actionName, proxyTable = '/api') => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? proxyTable : proxyTable) + actionName
}

// 阿里上传Ali
http.AliUrl = (actionName, proxyTable = '/ali/') => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? proxyTable : proxyTable) + actionName
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  return openDefultParams ? merge(params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  data = openDefultdata ? merge(data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

/**
 * 图片上传到oss统一封装
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.httpRequestImgConfig = (data = '', fileSize = '20000') => {
  let params = {
    FileExt: data,
    FileSize: '315392',
    Type: 'user',
  }
  if (fileSize) { params.FileSize = fileSize }
  return new Promise((resolve, reject) => {
    http({
      url: http.LogUrl('/v1/common/upload_oss_config'),
      method: 'post',
      data: http.adornParams(params)
    }).then(data => {
      if (data.status) { resolve({ data: {data:data.data}, status: data.status, response: data }) }
    }).catch((error) => {
      reject(error)
    })
  })
}

export default http
