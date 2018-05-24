import Vue from 'vue';
import axios from 'axios';
import qs from 'qs';
import store from '../store';
import Cookies from 'js-cookie';
import {Loading} from 'element-ui';
import {TokenKey,removeToken,getToken} from '@/utils/auth';
import Util from "@/assets/js/util.js";


Vue.prototype.$Util = Util;
Vue.prototype.$baseUrl = process.env.BASE_API;
Vue.prototype.$Cookies = Cookies;

Vue.prototype.$ajaxExport = function (url,params,cb) {
  let get_url = Util.getUrlPara(url, params,this);
  let xhr = new XMLHttpRequest();
  xhr.open('GET', get_url, true);
  xhr.setRequestHeader("Authorization", Cookies.get('token'));
  xhr.responseType = "blob";
  xhr.onload = function () {
    if (this.status === 200) {
      var blob = this.response;
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = function (e) {
        if (cb){
          cb(e)
        }
      }
    }
  };
  xhr.send()
};
Vue.prototype.$ajaxPost = function (url, data, config,isMask) {
  if(config == true || arguments[3] == true){
    return service.post(url, qs.stringify(data), true);
  }else{
    return service.post(url, qs.stringify(data), config);
  }
};
Vue.prototype.$ajaxGet = function (url,data,config,isMask) {
  let get_url = Util.getUrlPara(url, data,this);
  if(config == true || arguments[2] == true){
    return service.get(get_url,true);
  }else{
    return service.get(get_url,config);
  }
};
/*创建axios实例*/
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 5000
});
let mask = {};//遮罩对象
/*请求拦截器*/
service.interceptors.request.use(function (config) {
  //发送请求之前
  if(config[0] == true){
    mask = Loading.service({fullscreen: true, text: '拼命加载中....'});
  }
  //让每个请求携带Authorization
  if (store.getters.token) {
    // axios.defaults.headers.common['Authorization'] = getToken()
    config.headers['Authorization'] = getToken()
  }
  return config;
}, function (error) {
  //请求出错
  return Promist.reject(error);
});
/*响应拦截器*/
service.interceptors.response.use(function (res) {
  /*数据响应*/
  if (res.status === 200) {
    if(res.data.code == "999"){
      removeToken();
      Cookies.set("status",999);
      location.reload();
    }else{
      Cookies.remove("status");
    }
    if (typeof mask.close == "function") {
      mask.close();
    }
  }
  // 判断一下响应中是否有 token，如果有就直接使用此token替换掉本地的token
  var token = res.headers.authorization
  if (token) {
    // 如果 header 中存在 token，那么触发 refreshToken 方法，替换本地的 token
    this.$store.dispatch('RefreshToken', token)
  }
  return res;
}, function (error) {
  // switch (error.response.status) {
  //   //401触发logout方法,清除本地的数据并将用户重定向至登录页面
  //   case 401:
  //     return this.$store.dispatch('LogOut')
  //     break
  //   //400弹出一条错误提示给用户
  //   case 400:
  //     return this.$Message.error(error.response.data.error)
  //     break
  // }
  //响应出错
  return Promise.reject(error);
});

export default service;
