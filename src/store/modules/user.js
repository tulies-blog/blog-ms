import UserService from "@/services/user";
import { setUserInfo, getUserInfo, clearUserInfo } from "@/utils/authority";

const userService = new UserService();

// 从缓存中初始化用户信息
const userinfo = getUserInfo();

// initial state
const state = {
  userinfo: userinfo, // 从缓存中初始化用户信息
  // 列表
  listData: {},
  loading: {
    fetch: false, // 加载列表
  },
};

// getters
const getters = {};

// actions
const actions = {
  // 获取用户列表
  async list({ commit }, { payload }) {
    commit("setLoading", { fetch: true });
    // 这边调用获取用户列表
    const resp = await userService.list(payload);
    if (resp.code === 0) {
      commit("setListData", resp.data);
    }
    commit("setLoading", { fetch: false });
  },
  // 删除
  async delete({ commit }, { payload, callback }) {
    const { ids } = payload;
    let count = 0;
    for (const id of ids) {
      const resp = await userService.delete({ id });
      if (resp.code === 0) {
        count = count + 1;
      }
    }
    const result = {
      count,
    };
    if (callback) {
      callback(result);
    }
  },
  // 更改状态
  async changeStatus({ commit }, { payload, callback }) {
    const { ids, status } = payload;
    let count = 0;
    for (const id of ids) {
      const resp = await userService.changeStatus({
        id,
        status,
      });
      if (resp.code === 0) {
        count = count + 1;
      }
    }
    const result = {
      count,
    };
    if (callback) {
      callback(result);
    }
  },
  async login({ commit }, { payload, callback }) {
    // const { username, password } = payload
    const resp = await userService.login(payload);
    if (resp.code === 0) {
      setUserInfo(resp.data);
      commit("setUserinfo", resp.data);
    }
    if (callback) {
      callback(resp);
    }
  },
  async logout({ commit }, { payload, callback }) {
    // const { username, password } = payload
    commit("setUserinfo", {});
    clearUserInfo();

    if (callback) {
      callback();
    }
  },
};

// mutations
const mutations = {
  setLoading(state, payload) {
    state.loading = {
      ...state.loading,
      ...payload,
    };
  },
  setListData(state, listData) {
    state.listData = listData;
  },
  setUserinfo(state, userinfo) {
    state.userinfo = userinfo;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
