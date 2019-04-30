import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Toasted from 'vue-toasted'

Vue.use(BootstrapVue)
Vue.config.productionTip = true
Vue.use(Toasted)

new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})