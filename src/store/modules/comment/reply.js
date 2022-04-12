import CommentService from "@/services/comment";

const commentService = new CommentService();

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
    const resp = await commentService.listReply(payload);
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
      const resp = await commentService.deleteReply({ id });
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
      const resp = await commentService.changeReplyStatus({
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
  // 查询单个详情
  async info({ commit }, { payload, callback }) {
    const resp = await commentService.info(payload.id);
    if (callback) callback(resp);
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
