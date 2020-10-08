import axios from 'axios'
let instance = axios.create({
        timeout: 600000
    })
    // 请求拦截器
instance.interceptors.request.use(
    (config) => {
        // 触发loading效果
        //判断是否存在token,如果存在，则在header上加上token
        // let token = getStore('token')
        // if (token) {
        //     config.headers.common['token'] = token
        // }
        // if (config.method == 'post' || config.method == 'put') {
        //     //将数据转成string
        //     config.data = JSON.stringify(config.data)
        // } else if (config.method == 'get') {
        //     //&& browser.isIE
        //     //给Get添加时间戳 解决IE缓存问题
        //     let symbol = config.url.indexOf('?') >= 0 ? '&' : '?'
        //     config.url += symbol + '_=' + Date.now()
        //     config.data = qs.stringify(config.data)
        // }
        return config
    },
    (err) => {
        // 关闭loading
        // 失败提示
        return Promise.resolve(err)
    }
)

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        return response && response.data
    },
    (err) => {
        // 关闭loading
        // 提示异常
        // return Promise.resolve(err);
        //外部不会再处理
        return new Promise(() => {})
    }
)
export default instance;