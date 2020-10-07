// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
// import {
//   VueAxios
// } from './utils/request'
import ProLayout, {
    PageHeaderWrapper
} from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'


import bootstrap from './core/bootstrap'
import './core/lazy_use'
import './permission' // permission control
import './utils/filter' // global filter
import './global.less'
import axios from "./utils/http"
// import * as VueGoogleMaps from "vue2-google-maps";


Vue.config.productionTip = false

// mount axios to `Vue.$http` and `this.$http`
// Vue.use(VueAxios)
Vue.component('pro-layout', ProLayout)
Vue.component('page-header-wrapper', PageHeaderWrapper)

Vue.prototype.$http = axios;
window.umi_plugin_ant_themeVar = themePluginConfig.theme
    // Vue.use(VueGoogleMaps, {
    //   load: {
    //     key: "AIzaSyAw9nttrIUBzPTlK_AFaP7T5ySKgQ4gTTI",
    //     libraries: "places" // This is required if you use the Autocomplete plugin
    //   },
    //   // installComponents: false,
    // });
new Vue({
    router,
    store,
    i18n,
    created: bootstrap,
    render: h => h(App)
}).$mount('#app');