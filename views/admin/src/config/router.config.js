// eslint-disable-next-line
import {
    UserLayout,
    BasicLayout,
    BlankLayout
} from '@/layouts'
import {
    bxAnaalyse
} from '@/core/icons'

const RouteView = {
    name: 'RouteView',
    render: h => h('router-view')
}

export const constantRouterMap = [{
        path: '/',
        name: 'index',
        component: BasicLayout,
        meta: {
            title: 'menu.home'
        },
        redirect: '/product',
        children: [
            // dashboard
            {
                path: '/product',
                redirect: '/product',
                component: RouteView,
                meta: {
                    title: '网站框架',
                    icon: bxAnaalyse
                },
                children: [{
                    path: '',
                    name: 'product',
                    component: () =>
                        import ('@/views/product/index'),
                    meta: {
                        title: '产品列表'
                    }
                }]
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
        children: [{
            path: '/login',
            name: 'login',
            component: () =>
                import ( /* webpackChunkName: "user" */ '@/views/user/Login')
        }]
    }
]

/**
 * 基础路由
 * @type { *[] }
//  */
export const asyncRouterMap = []