import Base from "./base";
export default class UserService extends Base {
  async list(params) {
    const resp = await this.request("/user/list", { params });
    return resp;
  }
  async delete(data) {
    const resp = await this.request(`/user/delete`, {
      method: "POST",
      data,
    });
    return resp;
  }
  async changeStatus(data) {
    const resp = await this.request(`/user/changeStatus`, {
      method: "POST",
      data,
    });
    return resp;
  }
  async login(data) {
    const resp = await this.request(`/user/login`, {
      method: "POST",
      data,
    });
    return resp;
  }
}
