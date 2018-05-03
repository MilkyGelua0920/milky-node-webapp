import Vue from 'vue'
import axios from 'axios'

import App from './App.vue'
import router from './router'

Vue.http = Vue.prototype.$http = axios

new Vue({
	el: '#app',
	components: { App },
	router,
	template: '<App/>'
})