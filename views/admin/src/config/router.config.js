// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export const constantRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: 'menu.home'
    },
    redirect: '/base',
    children: [
      // dashboard
      {
        path: '/base',
        redirect: '/base',
        component: RouteView,
        meta: {
          title: '网站框架',
          icon: bxAnaalyse
        },
        children: [
          {
            path: '/base',
            name: 'base',
            component: () => import('@/views/base/index'),
            meta: {
              title: '基本配置'
            }
          },
          {
            path: '/swiper',
            name: 'swiper',
            component: () => import('@/views/swiper/index'),
            meta: {
              title: '轮播图'
            }
          },
          {
            path: '/buttons',
            name: 'buttons',
            component: () => import('@/views/buttons/index'),
            meta: {
              title: '方形按钮'
            }
          },
          {
            path: '/show',
            name: 'show',
            component: () => import('@/views/show/index'),
            meta: {
              title: '功能展示图'
            }
          },
          {
            path: '/stores',
            name: 'stores',
            component: () => import('@/views/stores/index'),
            meta: {
              title: '门店列表'
            }
          },
          {
            path: '/product',
            name: 'product',
            component: () => import('@/views/product/index'),
            meta: {
              title: '产品列表'
            }
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  },
  {
    path: '/login',
    component: UserLayout,
    redirect: '/login',
    hidden: true,
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      }
    ]
  }
]

/**
 * 基础路由
 * @type { *[] }
//  */
export const asyncRouterMap = []
