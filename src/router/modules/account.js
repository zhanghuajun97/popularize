/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/account',
  component: Layout,
  redirect: '/account/baidu',
  name: 'Accounts',
  meta: {
    title: '渠道账户配置',
    icon: 'table'
  },
  children: [
    {
      path: 'baidu',
      component: () => import('@/views/account/baidu'),
      meta: { title: '百度账号管理' }
    },
    {
      path: 'vivo',
      component: () => import('@/views/account/vivo'),
      meta: { title: 'vivo账号管理' }
    },
    {
      path: 'oppo',
      component: () => import('@/views/account/oppo'),
      meta: { title: 'oppo账号管理' }
    },
    {
      path: '360',
      component: () => import('@/views/account/360'),
      meta: { title: '点睛账号管理' }
    }
  ]
}
export default tableRouter
