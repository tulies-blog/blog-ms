import Vue from "vue";
import Vuex from "vuex";

import article from "./modules/article";
import resource from "./modules/resource";
import category from "./modules/category";
import user from "./modules/user";
import tag from "./modules/tag";
import comment from "./modules/comment/index";

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== "production";
export default new Vuex.Store({
  strict: debug,
  modules: {
    article,
    resource,
    category,
    user,
    tag,
    comment,
  },
});
