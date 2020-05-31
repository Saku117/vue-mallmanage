//插件模块
import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
    // 4. 添加实例方法
    axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    //在请求发起之前，来到下面的回调函数

    axios.interceptors.request.use(config => {
        if (config.url !== 'login') {
            const AUTH_TOKEN = localStorage.getItem("token");
            config.headers["Authorization"] = AUTH_TOKEN;
        }

        return config;
    }, error => {
        return Promise.reject(error)
    });

    axios.interceptors.response.use(response => {
        return response;
    }, error => {
        return Promise.reject(error);
    })



    Vue.prototype.$http = axios
    // 逻辑...
}

export default MyHttpServer