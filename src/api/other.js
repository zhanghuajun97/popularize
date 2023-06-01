import request from '@/utils/request'


// 同行库列表
export function peerList(data) {
  return request({
    url: 'api/other/peerList',
    method: 'post',
    data
  })
}

// 编辑同行库
export function auditPeer (data) {
  return request({
    url: 'api/other/auditPeer',
    method: 'post',
    data
  })
}

// 同行库屏蔽状态
export function changeUserStatus (data) {
  return request({
    url: 'api/other/changeUserStatus',
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

// 活码员工展示数
export function showCount (data) {
  return request({
    url: 'api/spread/showCount',
    method: 'post',
    data
  })
}

// 删除活码员工
export function delWecodeStaff (data) {
  return request({
    url: 'api/spread/delWecodeStaff',
    method: 'post',
    data
  })
}

// 搜索企微员工
export function searchUser (data) {
  return request({
    url: 'api/spread/searchUser',
    method: 'post',
    data
  })
}

// 添加企微员工
export function addWecodeStaff (data) {
  return request({
    url: 'api/spread/addWecodeStaff',
    method: 'post',
    data
  })
}

// 腾讯全链路列表
export function tencentList (data) {
  return request({
    url: 'api/other/tencentList',
    method: 'post',
    data
  })
}

// 删除腾讯全链路
export function tencentDel (data) {
  return request({
    url: 'api/other/tencentDel',
    method: 'post',
    data
  })
}

// 编辑腾讯全链路
export function auditTencent (data) {
  return request({
    url: 'api/other/auditTencent',
    method: 'post',
    data
  })
}

// 联系我部门树
export function getStaffDeptTree (data) {
  return request({
    url: 'api/wework/getStaffDeptTree',
    method: 'post',
    data
  })
}

// 联系我员工
export function searchStaffList (data) {
  return request({
     url: 'api/wework/searchStaffList',
     method: 'post',
     data
  })
}

// 登录账号与广告账号绑定列表
export function clientList (data) {
  return request({
    url: 'api/other/clientList',
    method: 'post',
    data
  })
}

// 登录账号绑定广告账号
export function addClient (data) {
  return request({
    url: 'api/other/addClient',
    method: 'post',
    data
  })
}

// 登录账号解绑广告账号
export function deleteClient (data) {
  return request({
    url: 'api/other/deleteClient',
    method: 'post',
    data
  })
}

// 平台列表
export function plateList (data) {
  return request({
    url: 'api/other/plateList',
    method: 'post',
    data
  })
}

// 搜素广告账号
export function searchAccountList (data) {
  return request({
    url: 'api/other/searchAccountList',
    method: 'post',
    data
  })
}

// 对外资源明细表
export function searchClientList (data) {
  return request({
    url: 'api/other/searchClientList',
    method: 'post',
    data
  })
}

// 对外资源明细统计表
export function resourceCensus (data) {
  return request({
    url: 'api/other/resourceCensus',
    method: 'post',
    data
  })
}

// 数据源列表
export function actionList (data) {
  return request({
    url: 'api/other/actionList',
    method: 'post',
    data
  })
}

// 删除数据源
export function actionDel (data) {
  return request({
    url: 'api/other/actionDel',
    method: 'post',
    data
  })
}

// 编辑数据源
export function auditAction (data) {
  return request({
    url: 'api/other/auditAction',
    method: 'post',
    data
  })
}

// 活码投放页面
export function staffHtmlList (data) {
  return request({
    url: 'api/spread/staffHtmlList',
    method: 'post',
    data
  })
}

// 运营形式列表
export function operateType (data) {
  return request({
    url: 'api/plate/operateStyle',
    method: 'post',
    data
  })
}

// 新增运营形式
export function addOperate (data) {
  return request({
    url: 'api/plate/addOperate',
    method: 'post',
    data
  })
}

// 删除运营形式
export function delOperate (data) {
  return request({
    url: 'api/plate/delOperate',
    method: 'post',
    data
  })
}

// 活码页面一键暂停
export function staffAllPause (data) {
  return request({
    url: 'api/spread/staffAllPause',
    method: 'post',
    data
  })
}

// 活码页面一键解绑
export function staffAllDelete (data) {
  return request({
    url: 'api/spread/staffAllDelete',
    method: 'post',
    data
  })
}



