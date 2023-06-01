// 渠道账户配置
import request from '@/utils/request'

// 百度列表
export function baiduList(data) {
  return request({
    url: 'api/source/baiduList',
    method: 'post',
    data
  })
}

// 百度详情
export function baiduInfo(data) {
  return request({
    url: 'api/source/baiduInfo',
    method: 'post',
    data
  })
}

// 编辑百度账号
export function auditBaidu(data) {
  return request({
    url: 'api/source/auditBaidu',
    method: 'post',
    data
  })
}  

// 360列表
export function ocpcList(data) {
  return request({
    url: 'api/source/ocpcList',
    method: 'post',
    data
  })
} 

// 360详情
export function ocpcInfo(data) {
  return request({
    url: 'api/source/ocpcInfo',
    method: 'post',
    data
  })
} 

// 360账号编辑
export function editOcpc(data) {
  return request({
    url: 'api/source/editOcpc',
    method: 'post',
    data
  })
} 

// 新增360账号
export function addOcpc(data) {
  return request({
    url: 'api/source/addOcpc',
    method: 'post',
    data
  })
}

// Oppo账号列表
export function oppoList(data) {
  return request({
    url: 'api/source/oppoList',
    method: 'post',
    data
  })
} 

// Oppo账号详情
export function oppoInfo (data) {
  return request({
    url: 'api/source/oppoInfo',
    method: 'post',
    data
  })
}

// 编辑Oppo账号
export function auditOppo (data) {
  return request({
    url: 'api/source/auditOppo',
    method: 'post',
    data
  })
} 

// Vivo账号列表
export function vivoList (data) {
  return request({
    url: 'api/source/vivoList',
    method: 'post',
    data
  })
}

// vivo账号详情
export function vivoInfo (data) {
  return request({
    url: 'api/source/vivoInfo',
    method: 'post',
    data
  })
}

// vivo账号编辑
export function auditVivo (data) {
  return request({
    url: 'api/source/auditVivo',
    method: 'post',
    data
  })
}





