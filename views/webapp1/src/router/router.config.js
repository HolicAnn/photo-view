/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [{
        path: "*",
        redirect: "/"
    },
    {
        path: '/',
        name: 'home',
        component: () =>
            import ('@/views/home'),
        meta: {
            title: '首页',
            keepAlive: false
        }
    },
    {
        path: '/detail/:id',
        name: 'detail',
        component: () =>
            import ('@/views/detail'),
        meta: {
            title: '详情',
            keepAlive: false
        }
    }

]