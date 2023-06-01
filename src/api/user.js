import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/user/login ',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  return request({
    url: 'api/user/userInfo',
    method: 'get',
    data
  })
}

export function userMenuList () {
  return request({
    url: 'api/user/userMenuList',
    method: 'get',
  })
}  

export function logout(token) {
  return request({
    url: '/api/user/loginOut',
    method: 'get',
    params: { token }
  })
}

// 用户列表
export function userList (data) {
  return request({
    url: 'api/user/userList',
    method: 'post',
    data
  })
}

// 注册用户
export function registerUser (data) {
  return request({
    url: 'api/user/registerUser',
    method: 'post',
    data
  })
}

// 编辑用户信息
export function editUser (data) {
  return request({
    url: 'api/user/editUser',
    method: 'post',
    data
  })
}

// 角色列表
export function groupList (data) {
  return request({
    url: 'api/user/groupList',
    method: 'post',
    data
  })
}

// 新增修改角色
export function auditGroup (data) {
  return request({
    url: 'api/user/auditGroup',
    method: 'post',
    data
  })
}

// 菜单列表
export function menuList (data) {
  return request({
    url: 'api/user/menuList',
    method: 'post',
    data
  })
}

// 新增编辑菜单
export function auditMenu (data) {
  return request({
    url: 'api/user/auditmenu',
    method: 'post',
    data
  })
}

// 设置角色权限
export function setGroupMenu (data) {
  return request({
    url: 'api/user/setGroupMenu',
    method: 'post',
    data
  })
}

// 删除菜单
export function deleteMenu (data) {
  return request({
    url: 'api/user/deleteMenu',
    method: 'post',
    data
  })
}

// 设置用户角色
export function setUserGroup (data) {
  return request({
    url: 'api/user/setUserGroup',
    method: 'post',
    data
  })
}

// 修改密码
export function editPassword (data) {
  return request({
    url: 'api/user/editPassword',
    method: 'post',
    data
  })
}

