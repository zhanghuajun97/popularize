/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const componentsRouter = {
  path: '/control',
  component: Layout,
  redirect: 'noRedirect',
  meta: {
    title: '对外企微',
    icon: 'component'
  },
  children: [
    {
      path: 'resourcedetail',
      name: 'resourcedetail',
      component: () => import('@/views/control/resourceDetail'),
      meta: { title: '资源明细报表' }
    },
    {
      path: 'resourcedata',
      name: 'resourcedata',
      component: () => import('@/views/control/resourceData'),
      meta: { title: '资源明细统计表' }
    },
    {
      path: 'opreate',
      name: 'opreate',
      component: () => import('@/views/control/operate'),
      meta: { title: '运营形式列表' }
    }
  ]
}

export default componentsRouter