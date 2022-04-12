import Base from "./base";
export default class UserService extends Base {
  async listTopic(params) {
    const resp = await this.request("/comment/topic/list", { params });
    return resp;
  }
  async deleteTopic(data) {
    const resp = await this.request(`/comment/topic/delete`, {
      method: "POST",
      data,
    });
    return resp;
  }
  async changeTopicStatus(data) {
    const resp = await this.request(`/comment/topic/changeStatus`, {
      method: "POST",
      data,
    });
    return resp;
  }

  /**
   *  下面是reply的东西
   */
  async listReply(params) {
    const resp = await this.request("/comment/reply/list", { params });
    return resp;
  }
  async deleteReply(data) {
    const resp = await this.request(`/comment/reply/delete`, {
      method: "POST",
      data,
    });
    return resp;
  }
  async changeReplyStatus(data) {
    const resp = await this.request(`/comment/reply/changeStatus`, {
      method: "POST",
      data,
    });
    return resp;
  }
  async info(id) {
    const resp = await this.request(`/comment/reply/info/${id}`);
    return resp;
  }
}
