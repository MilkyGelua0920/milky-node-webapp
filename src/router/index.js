import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import IndexComponent from './../components/Index.vue'

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index-page',
      component: IndexComponent
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
