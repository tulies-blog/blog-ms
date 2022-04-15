import Base from "./base";
export default class UserService extends Base {
  async list(params) {
    const resp = await this.request("/users", { params });
    return resp;
  }
  async delete(id) {
    const resp = await this.request(`/users/${id}`, {
      method: "DELETE",
    });
    return resp;
  }
  async changeStatus(id, status) {
    const resp = await this.request(`/users/${id}/status/${status}`, {
      method: "PATCH",
    });
    return resp;
  }
  async login(data) {
    const resp = await this.request(`/login/login`, {
      method: "POST",
      data,
    });
    return resp;
  }
}
