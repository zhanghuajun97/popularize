/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const componentsRouter = {
  path: '/tools',
  component: Layout,
  redirect: 'noRedirect',
  meta: {
    title: '平台工具配置',
    icon: 'component'
  },
  children: [
    {
      path: 'sesame',
      component: () => import('@/views/tools/sesame'),
      meta: { title: '芝麻小事标签管理' }
    },
    {
      path: 'account',
      component: () => import('@/views/tools/account'),
      meta: { title: '微信平台账号管理' }
    },
    {
      path: 'company',
      component: () => import('@/views/tools/company'),
      meta: { title: '企业微信客服管理' }
    },
    // {
    //   path: 'reply',
    //   component: () => import('@/views/tools/reply'),
    //   meta: { title: '企微客服回复列表' }
    // },
    {
      path: 'tencent',
      name: 'tencent',
      component: () => import('@/views/other/tencent'),
      meta: { title: '腾讯全链路账号管理' }
    },
    {
      path: 'dataresource',
      name: 'dataresource',
      component: () => import('@/views/other/dataResource'),
      meta: { title: '数据源管理' }
    }
  ]
}

export default componentsRouter
