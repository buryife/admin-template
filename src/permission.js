import router from './router';
import store from './store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {getToken} from '@/utils/auth';
NProgress.configure({showSpinner: false});

const whiteList = ['/login', '/register'];

router.beforeEach((to, from, next) => {
  NProgress.start();
  if (getToken()&&sessionStorage.getItem('menu_list')) {
    if (to.path === '/login') {
      next('/home');
      NProgress.done();
    } else {
      store.dispatch('updatePageButton', to.name).then(() => { // 根据roles权限生成可访问的路由表
        next();
      })
      next();
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next('/login');
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
