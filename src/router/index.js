import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/pages/login/index'


Vue.use(Router);
export default new Router({
  routes: [
    {
      path: '/',
      redirect: "/login"
    },
    {
      path: '/login',
      component: Login
    },
  ]
});
