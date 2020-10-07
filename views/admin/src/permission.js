import router from './router'
import store from './store'
// import storage from 'store'
import Cookies from 'js-cookie'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style

NProgress.configure({
        showSpinner: false
    }) // NProgress Configuration

const whiteList = ['/login', '/register', '/registerResult'] // no redirect whitelist

router.beforeEach((to, from, next) => {
    NProgress.start() // start progress bar
    if (Cookies.get('admin_token')) {
        next()
    } else {
        if (whiteList.includes(to.path)) {
            // 在免登录白名单，直接进入
            console.log(2222)
            next()
        } else {
            //next()
            next({
                path: '/login'
            })
            NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
        }
    }
    console.log(111)

})

router.afterEach(() => {
    NProgress.done() // finish progress bar
})