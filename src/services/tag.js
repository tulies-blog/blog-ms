import Base from "./base";
export default class TagService extends Base {
  async list(params) {
    const resp = await this.request("/tag/list", { params });
    return resp;
  }
  async delete(data) {
    const resp = await this.request(`/tag/delete`, {
      method: "POST",
      data,
    });
    return resp;
  }
  async changeStatus(data) {
    const resp = await this.request(`/tag/changeStatus`, {
      method: "POST",
      data,
    });
    return resp;
  }
}
