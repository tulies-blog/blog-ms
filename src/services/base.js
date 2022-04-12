import axios from "axios";

import router from "@/router/index";
import store from "@/store/index";
import { getUserInfo } from "@/utils/authority";

export default class BaseService {
  // constructor () {
  // this.app = {
  //   router,
  //   store
  // }
  // this.router = router
  // this.store = store
  // }

  request(url, option) {
    // console.log(store, router)
    const userinfo = getUserInfo();
    let ssotoken = "";
    if (userinfo) {
      const { userToken } = userinfo;
      ssotoken = userToken;
    }
    const defaultOptions = {
      method: "GET",
      headers: { ssotoken },
    };
    const options = {
      ...defaultOptions,
      url: `/api${url}`,
      ...option,
    };
    // console.log(options)
    return axios
      .request(options)
      .then((res) => {
        return res.data;
      })
      .catch((e) => {
        console.log(e.response);
        const status = e.response.status;
        if (status === 401) {
          store.dispatch({
            type: "uc/logout",
          });
          return;
        }
        // environment should not be used
        if (status === 403) {
          router.push("/exception/403");
          return;
        }
        if (status <= 504 && status >= 500) {
          router.push("/exception/500");
          return;
        }
        if (status >= 404 && status < 422) {
          router.push("/exception/404");
          return;
        }
        return e;
      });
  }
}
