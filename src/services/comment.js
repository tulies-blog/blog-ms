import Base from "./base";
export default class UserService extends Base {
  async listTopic(params) {
    const resp = await this.request("/comment/topics", { params });
    return resp;
  }
  async deleteTopic(id) {
    const resp = await this.request(`/comment/topics/${id}`, {
      method: "DELETE",
    });
    return resp;
  }
  async changeTopicStatus(id, status) {
    const resp = await this.request(`/comment/topics/${id}/status/${status}`, {
      method: "PATCH",
    });
    return resp;
  }

  /**
   *  下面是reply的东西
   */
  async listReply(params) {
    const resp = await this.request("/comment/replys", { params });
    return resp;
  }
  async deleteReply(id) {
    const resp = await this.request(`/comment/replys/${id}`, {
      method: "DELETE",
    });
    return resp;
  }
  async changeReplyStatus(id, status) {
    const resp = await this.request(`/comment/replys/${id}/status/${status}`, {
      method: "PATCH",
    });
    return resp;
  }
  async info(id) {
    const resp = await this.request(`/comment/replys/${id}`);
    return resp;
  }
}
