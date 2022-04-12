import TagService from "@/services/tag";

const tagService = new TagService();

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
    const resp = await tagService.list(payload);
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
      const resp = await tagService.delete({ id });
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
      const resp = await tagService.changeStatus({
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
