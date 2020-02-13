
import axios from 'axios'
import httpRequest from '@/utils/httpRequest'
import VueCookie from 'vue-cookie'
import JSONbig from 'json-bigint'

// axios.defaults.baseURL = 'http://27.115.48.247:8090/';
// let serverUrl = 'http://e.shianxian.cn:80/api' //生产环境
axios.defaults.withCredentials = true
axios.defaults.timeout = 1000 * 30

const configheaders = {
  headers: {
    'Content-Type': 'application/json;multipart/form-data;',
    'Authorization': 'tXWFGKCbrq6jJAmO',
    'noencrypt': '1',
    'notsign': '1'
  }
}

export function AjaxPost(url, data, config) {
  if (!config) { config = configheaders }
  return new Promise((resolve, reject) => {
    axios.post(url, data, config)
      .then(response => {
        if (response.status) { resolve({ data: response.data, status: response.status, response: response }) }
      }, err => {
        resolve({ response: err.response, status: err.response.status })
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function AjaxGet(url, data, config) {
  if (!config) { config = configheaders }
  return new Promise((resolve, reject) => {
    axios.get(url, data, config)
      .then(response => {
        if (response.status) { resolve({ data: response.data, status: response.status, response: response }) }
      }, err => {
        resolve({ response: err.response, status: err.response.status })
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function AjaxDelete(url, data, config) {
  if (!config) { config = configheaders }
  return new Promise((resolve, reject) => {
    axios.delete(url, data, config)
      .then(response => {
        if (response.status) { resolve({ data: response.data, status: response.status, response: response }) }
      }, err => {
        resolve({ response: err.response, status: err.response.status })
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function AjaxPut(url, data, config) {
  if (!config) { config = configheaders }
  return new Promise((resolve, reject) => {
    axios.put(url, data, config)
      .then(response => {
        if (response.status) { resolve({ data: response.data, status: response.status, response: response }) }
      }, err => {
        resolve({ response: err.response, status: err.response.status })
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 重置图片公用参数
const params = {
  'params': {

  },
  'common': {
    '_facturer': 'Cherry+Mobile',
    '_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI3MDYiLCJhcHBJRCI6MTIsImV4cCI6MTYwNDU0ODU5NiwiaWF0IjoxNTc4NjI4NTk2fQ.oITuwJKFp89RuwFGwKM-4A0pbbvsCRWc9sL5_J4px_s',
    '_imei': 'c014e626f4b24959',
    '_brand': 'Cherry_Mobile',
    '_mac': '7c:b9:60:10:45:7e',
    '_appLanguage': 'en',
    '_pcId': 'norelease',
    '_dId': 'Flare_S6_Plus',
    '_aKey': 'ANDROID',
    '_vOs': '7.0',
    '_uid': '',
    '_cpu': 'arm64-v8a',
    '_devid': 'AAE73495F6E25E7A2200701D45BFC7E3',
    '_uId': '7567797862984936960',
    '_vName': '1.2.6',
    '_lang': 'zh_',
    '_androidID': 'c014e626f4b24959',
    '_pName': 'com.newspark.mobile',
    '_pgLoad': '0',
    '_timezone': 'GMT+08:00_Asia/Shanghai',
    '_region': 'en',
    '_px': '720x1296',
    '_udid': 'A8AB99B9F25B868B99FB06244C5FDAC0',
    '_rt': '0',
    '_imsi': '',
    '_vApp': '8376',
    '_t': new Date().getTime(),
    '_nId': '1',
    '_abId': ''
  }
}

export function ResetPicture(data, fileSize) {
  params.params = {
    fileExt: data,
    fileSize: '315392',
    type: '2',
  }
  if (VueCookie.get('token')) {
    params.common._token = VueCookie.get('token')
  }
  if (fileSize) { params.params.fileSize = fileSize }
  return AjaxPost(httpRequest.ImgUrl('/v1/upload/img/config'), params)
}
// 一元夺宝强制下线掉8270基础参数
export function ForcedOffline(data, url) {
  params.params = Object.assign(params.params, data)
  if (VueCookie.get('token')) {
    params.common._token = VueCookie.get('token')
  }
  return AjaxPost(httpRequest.ImgUrl(url), params)
}

// 统一8070
export function RechargeSubmitted(data, url) {
  params.params = data
  if (VueCookie.get('token')) {
    params.common._token = VueCookie.get('token')
  }
  return AjaxPost(httpRequest.ImgUrl(url), params, {
    headers: {
      'Content-Type': 'application/json;multipart/form-data;',
      'Authorization': 'tXWFGKCbrq6jJAmO',
      'noencrypt': '1',
      'notsign': '1'
    },
    transformResponse: [function (data) {
      // Do whatever you want to transform the data
      return JSONbig.parse(data)
    }],
  })
}

const http = {
  AjaxPost,
  AjaxGet,
  AjaxDelete,
  AjaxPut,
  ResetPicture,
  ForcedOffline,
  RechargeSubmitted
}

export default http
