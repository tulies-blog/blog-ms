import axios from "axios";
// import { getUserInfo } from '@/utils/authority'
// const codeMessage = {
//   200: '服务器成功返回请求的数据。',
//   201: '新建或修改数据成功。',
//   202: '一个请求已经进入后台排队（异步任务）。',
//   204: '删除数据成功。',
//   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
//   401: '用户没有权限（令牌、用户名、密码错误）。',
//   403: '用户得到授权，但是访问是被禁止的。',
//   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
//   406: '请求的格式不可得。',
//   410: '请求的资源被永久删除，且不会再得到的。',
//   422: '当创建一个对象时，发生一个验证错误。',
//   500: '服务器发生错误，请检查服务器。',
//   502: '网关错误。',
//   503: '服务不可用，服务器暂时过载或维护。',
//   504: '网关超时。'
// }

export default {
  install(Vue, options) {
    // console.log(Vue, options)
    // Vue.myGlobalMethod = function () { // 1. 添加全局方法或属性，如:  vue-custom-element
    //   // 逻辑...
    // }

    // Vue.directive('my-directive', { // 2. 添加全局资源：指令/过滤器/过渡等，如 vue-touch
    //   bind (el, binding, vnode, oldVnode) {
    //     // 逻辑...
    //   }
    // })

    // Vue.mixin({
    //   created: function () { // 3. 通过全局 mixin方法添加一些组件选项，如: vuex
    //     // 逻辑...
    //   }
    // })

    // Vue.prototype.$myMethod = function (options) { // 4. 添加实例方法，通过把它们添加到 Vue.prototype 上实现
    //   // 逻辑...
    // }
    Vue.prototype.$curl = (url, option) => {
      // const userinfo = getUserInfo()
      let datavtoken = "";
      // if (userinfo) {
      //   const { token } = userinfo
      //   datavtoken = token
      // }

      const defaultOptions = {
        method: "GET",
        headers: { datavtoken: datavtoken },
      };
      const options = {
        ...defaultOptions,
        url: `/dataapi${url}`,
        ...option,
      };
      return axios
        .request(options)
        .then((res) => {
          return res;
        })
        .catch((e) => {
          console.log(e.response);
          // const status = e.response.status
          // if (status === 401) {
          //   app.store.dispatch({
          //     type: 'uc/logout'
          //   })
          //   return
          // }
          // // environment should not be used
          // if (status === 403) {
          //   app.router.push('/exception/403')
          //   return
          // }
          // if (status <= 504 && status >= 500) {
          //   app.router.push('/exception/500')
          //   return
          // }
          // if (status >= 404 && status < 422) {
          //   app.router.push('/exception/404')
          //   return
          // }
          return e;
        });
    };
  },
};
