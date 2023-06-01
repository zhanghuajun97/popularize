/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chartsRouter = {
  path: '/popularize',
  component: Layout,
  redirect: '/popularize/fixation',
  name: 'popularize',
  meta: {
    title: '推广管理',
    icon: 'chart'
  },
  children: [
    {
      path: 'fixation',
      component: () => import('@/views/popularize/fixation'),
      name: 'Fixation',
      meta: { title: '联系我固定码' }
    },
    {
      path: 'wecode',
      name: 'wecode',
      component: () => import('@/views/popularize/wecode'),
      meta: { title: '企微带参活码' }
    },
    {
      path: 'popularize',
      component: () => import('@/views/popularize/popularize'),
      name: 'Popularize',
      // hidden: true,
      meta: { title: '推广页面链接' }
    },
    {
      path: 'keyword',
      component: () => import('@/views/popularize/keyword'),
      name: 'Keyword',
      meta: { title: '推广页面关键词' }
    }
  ]
}

export default chartsRouter
