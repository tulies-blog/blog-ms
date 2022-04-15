import ArticleService from "@/services/article";

const articleService = new ArticleService();

// initial state
const state = {
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
    const resp = await articleService.list(payload);
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
      const resp = await articleService.delete(id);
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
  async create({ commit }, { payload, callback }) {
    const resp = await articleService.create(payload);
    if (callback) callback(resp);
  },
  async update({ commit }, { payload, callback }) {
    const resp = await articleService.update(payload);
    if (callback) callback(resp);
  },
  async info({ commit }, { payload, callback }) {
    const resp = await articleService.info(payload.id);
    if (callback) callback(resp);
  },
  async changeStatus({ commit }, { payload, callback }) {
    const { ids, status } = payload;
    let count = 0;
    for (const id of ids) {
      const resp = await articleService.changeStatus(id, status);
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
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
