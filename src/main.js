import Vue from 'vue';
import router from './router';
import $ from 'jquery';
import store from "./store";
import App from './App';
import axios from 'axios';
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css'

import "babel-polyfill";
import  VueResource  from 'vue-resource'
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

//公共方法
import handle_data from "./utilis/handle_data.js";
Vue.prototype.handle_data  = handle_data;

Vue.use(ElementUI);
Vue.use(VueResource);

Vue.prototype.$axios = axios;

//时间过滤器
Vue.filter('timeFilter', function (value) {
    var value = String(value)
    if(value.length == 1){
        return "0" + value
    }else{
        return value
    }
    return Numer(value)
})

var vm = new Vue({
    el: "#app",
    router,
    store,
    render: h => h(App),
    render: h => h(App),
    http: {
        root: '/',
        headers: {
            sign: localStorage.getItem("sign")
        }
    }
});
