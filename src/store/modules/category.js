import CategoryService from "@/services/category";

const categoryService = new CategoryService();

// initial state
const state = {
  // 列表
  treeData: [],
  loading: {
    fetch: false, // 加载列表
  },
};

// getters
const getters = {};

// actions
const actions = {
  // 获取用户列表
  async tree({ commit }) {
    // 这边调用获取用户列表
    const resp = await categoryService.tree();
    if (resp.code === 0) {
      commit("setTreeData", resp.data);
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
  setTreeData(state, treeData) {
    state.treeData = treeData;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
