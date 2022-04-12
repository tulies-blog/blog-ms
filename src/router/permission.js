import router from "./index";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getUserInfo } from "@/utils/authority";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

// permission judge function
// function hasPermission (roles, permissionRoles) {
//   if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
//   if (!permissionRoles) return true
//   return roles.some(role => permissionRoles.indexOf(role) >= 0)
// }

const whiteList = ["/user/login"]; // no redirect whitelist

router.beforeEach((to, from, next) => {
  // console.log('router.beforeEach', to, from, next)
  NProgress.start(); // start progress bar
  const userinfo = getUserInfo();

  if (userinfo && userinfo.userToken) {
    // determine if there has token
    /* has token */
    if (to.path === "/user/login") {
      next({ path: "/" });
      NProgress.done(); // if current page is dashboard will not trigger afterEach hook, so manually handle it
    } else {
      next();
    }
  } else {
    /* has no token */
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next(`/user/login?redirect=${to.path}`); // 否则全部重定向到登录页
      NProgress.done(); // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // finish progress bar
});
