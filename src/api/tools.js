import request from '@/utils/request'


// 微信平台账号列表
export function wechatSetList(data) {
  return request({
    url: 'api/plate/wechatSetList',
    method: 'post',
    data
  })
}

// 回传类型列表
export function returnType(data) {
  return request({
    url: 'api/plate/returnType',
    method: 'post',
    data
  })
}

// 微信平台账号详情
export function wechatSetInfo (data) {
  return request({
    url: 'api/plate/wechatSetInfo',
    method: 'post',
    data
  })
}

// 编辑微信平台账号
export function auditWechatSet (data) {
  return request({
    url: 'api/plate/auditWechatSet',
    method: 'post',
    data
  })
}

// 芝麻小事标签列表
export function sesameList (data) {
  return request({
    url: 'api/plate/sesameList',
    method: 'post',
    data
  })
}

// 编辑芝麻小事标签
export function auditSesame (data) {
  return request({
    url: 'api/plate/auditSesame',
    method: 'post',
    data
  })
}

// 企微客服账号列表
export function weworkList (data) {
  return request({
    url: 'api/plate/weworkList',
    method: 'post',
    data
  })
}

// 企微客服账号详情
export function weworkInfo (data) {
  return request({
    url: 'api/plate/weworkInfo',
    method: 'post',
    data
  })
}

// 编辑企微客服账号
export function auditWework (data) {
  return request({
    url: 'api/plate/auditWework',
    method: 'post',
    data
  })
}

// 回复客服列表
export function weworkMsgList (data) {
  return request({
    url: 'api/plate/weworkMsgList',
    method: 'post',
    data
  })
} 


// 选择企微客服列表
export function msgKfList () {
  return request({
    url: 'api/plate/msgKfList',
    method: 'post'
  })
}

// 编辑客服回复
export function auditWeworkMsg (data) {
  return request({
    url: 'api/plate/auditWeworkMsg',
    method: 'post',
    data
  })
}