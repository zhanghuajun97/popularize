/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const nestedRouter = {
  path: '/other',
  component: Layout,
  redirect: '/other/backdata',
  name: 'other',
  meta: {
    title: '其他',
    icon: 'nested'
  },
  children: [
    {
      path: 'peer',
      name: 'peer',
      component: () => import('@/views/other/peer'),
      meta: { title: '同行库' }
    },
    {
      path: 'userlist',
      name: 'userlist',
      component: () => import('@/views/other/userlist'),
      meta: { title: '用户列表' }
    },
    {
      path: 'grouplist',
      name: 'grouplist',
      component: () => import('@/views/other/grouplist'),
      meta: { title: '角色列表' }
    },
    {
      path: 'menu',
      name: 'menu',
      component: () => import('@/views/other/menu'),
      meta: { title: '菜单管理' }
    }
  ]
}

export default nestedRouter
