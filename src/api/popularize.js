import request from '@/utils/request'


// 推广页面关键字列表
export function configList(data) {
  return request({
    url: 'api/spread/configList',
    method: 'post',
    data
  })
}

// 推广页面关键字详情
export function configInfo(data) {
  return request({
    url: 'api/spread/configInfo',
    method: 'post',
    data
  })
}

// 编辑推广页面关键字
export function auditConfig (data) {
  return request({
    url: 'api/spread/auditConfig',
    method: 'post',
    data
  })
}

// 固定二维码列表
export function wechatCodeList (data) {
  return request({
    url: 'api/spread/wechatCodeList',
    method: 'post',
    data
  })
}

// 固定二维码详情
export function wechatCodeInfo (data) {
  return request({
    url: 'api/spread/wechatCodeInfo',
    method: 'post',
    data
  })
}

// 上传图片
export function upload (data) {
  return request({
    url: 'api/spread/upload',
    method: 'post',
    data
  })
}

// 编辑二维码
export function auditWechatCode (data) {
  return request({
    url: 'api/spread/auditWechatCode',
    method: 'post',
    data
  })
}

// 删除固定二维码
export function delWechatCode (data) {
  return request({
    url: 'api/spread/delWechatCode',
    method: 'post',
    data
  })
}

// 修改固定码状态
export function changeWechatCodeStatus (data) {
  return request({
    url: 'api/spread/changeWechatCodeStatus',
    method: 'post',
    data
  })
}

// 固定码展示次数
export function showCount (data) {
  return request({
    url: 'api/spread/showCount',
    method: 'post',
    data
  })
}

// 推广页面列表
export function type(data) {
  return request({
    url: 'api/spread/type',
    method: 'post',
    data
  })
}

// 删除推广页面
export function typeDel(data) {
  return request({
    url: 'api/spread/typeDel',
    method: 'post',
    data
  })
}

// 修改推广页面推广状态
export function typeUse(data) {
  return request({
    url: 'api/spread/typeUse',
    method: 'post',
    data
  })
}

// 推广页面固定码列表
export function getTypeCode (data) {
  return request({
    url: 'api/spread/getTypeCode',
    method: 'post',
    data
  })
}

// 更改页面下固定码是否使用
export function updateWecodeStatus (data) {
  return request({
    url: 'api/spread/updateWecodeStatus',
    method: 'post',
    data
  })
}

// 修改页面下固定码权重
export function editWeight (data) {
  return request({
    url: 'api/spread/editWeight',
    method: 'post',
    data
  })
}

// 删除页面固定二维码
export function typeCodeDel (data) {
  return request({
    url: 'api/spread/typeCodeDel',
    method: 'post',
    data
  })
}

// 页面新增固定二维码
export function typeCodeAdd (data) {
  return request({
    url: 'api/spread/typeCodeAdd',
    method: 'post',
    data
  })
}

// 页面下活码列表
export function weworkRelation (data) {
  return request({
    url: 'api/spread/weworkRelation',
    method: 'post',
    data
  })
}

// 删除页面下活码
export function delWeworkRelation (data) {
  return request({
    url: 'api/spread/delWeworkRelation',
    method: 'post',
    data
  })
}

// 新增页面下活码
export function addWeworkRelation (data) {
  return request({
    url: 'api/spread/addWeworkRelation',
    method: 'post',
    data
  })
}                                                                                                                                                            

// 活码员工列表
export function wecodeStaffList (data) {
  return request({
    url: 'api/spread/wecodeStaffList',
    method: 'post',
    data
  })
}

// 多页面下活码列表
export function allCodeList (data) {
  return request({
    url: 'api/spread/allCodeList',
    method: 'post',
    data
  })
}

// 多页面下新增活码
export function addRelationAll (data) {
  return request({
    url: 'api/spread/addRelationAll',
    method: 'post',
    data
  })
}

// 多页面删除活码
export function delRelationAll (data) {
  return request({
    url: 'api/spread/delRelationAll',
    method: 'post',
    data
  })
}

// 获取账号列表
export function getChannelAccount (data) {
  return request({
    url: 'api/spread/getChannelAccount',
    method: 'post',
    data
  })
}

// 获取渠道列表
export function getSourceByCrm (data) {
  return request({
    url: 'api/spread/getSourceByCrm',
    method: 'post',
    data
  })
}

// 链接详情
export function typeInfo (data) {
  return request({
    url: 'api/spread/typeInfo',
    method: 'post',
    data
  })
}

// 新增/编辑链接
export function auditType (data) {
  return request({
    url: 'api/spread/auditType',
    method: 'post',
    data
  })
}

// 联系我列表
export function contactList (data) {
  return request({
    url: 'api/wework/contactList',
    method: 'post',
    data
  })
}

// 新增联系我二维码
export function addContact (data) {
  return request({
    url: 'api/wework/addContact',
    method: 'post',
    data
  })
}

// 编辑联系我二维码
export function editContact (data) {
  return request({
    url: 'api/wework/editContact',
    method: 'post',
    data
  })
}

// 删除联系我二维码
export function deleteContact (data) {
  return request({
    url: 'api/wework/deleteContact',
    method: 'post',
    data
  })
}

// 联系我二维码
export function contactInfo (data) {
  return request({
    url: 'api/wework/contactInfo',
    method: 'post',
    data
  })
}

// 页面下联系我列表
export function searchContactOfType (data) {
  return request({
    url: 'api/wework/searchContactOfType',
    method: 'post',
    data
  })
}

// 添加页面下联系我二维码
export function setTypeContact (data) {
  return request({
    url: 'api/wework/setTypeContact',
    method: 'post',
    data
  })
}

// 删除页面下联系我二维码
export function deleteTypeContact (data) {
  return request({
    url: 'api/wework/deleteTypeContact',
    method: 'post',
    data
  })
}

// 同步活码员工绑定销售
export function syncCrmInfo (data) {
  return request({
    url: 'api/spread/syncCrmInfo',
    method: 'post',
    data
  })
}

// 修改页面下活码暂停状态
export function changeWeworkPause (data) {
  return request({
    url: 'api/spread/changeWeworkPause',
    method: 'post',
    data
  })
}

// 活码多页面下暂停状态列表
export function allCodePauseList (data) {
  return request({
    url: 'api/spread/allCodePauseList',
    method: 'post',
    data
  })
}

// 修改多页面暂停状态
export function changeRelationPause (data) {
  return request({
    url: 'api/spread/changeRelationPause',
    method: 'post',
    data
  })
}

// 优化师列表
export function getSpreadUser (data) {
  return request({
    url: 'api/spread/getSpreadUser',
    method: 'post',
    data
  })
}