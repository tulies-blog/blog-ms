import BaseService from "./base";
export default class ArticleService extends BaseService {
  async list(params) {
    const resp = await this.request("/article/list", { params });
    return resp;
  }
  async delete(data) {
    const resp = await this.request(`/article/delete`, {
      method: "POST",
      data,
    });
    return resp;
  }
  async create(data) {
    const resp = await this.request(`/article/create`, {
      method: "POST",
      data,
    });

    return resp;
  }
  async update(data) {
    const resp = await this.request(`/article/update`, {
      method: "POST",
      data,
    });
    return resp;
  }
  async info(id) {
    const resp = await this.request(`/article/info/${id}`);
    return resp;
  }
  async changeStatus(data) {
    const resp = await this.request(`/article/changeStatus`, {
      method: "POST",
      data,
    });
    return resp;
  }
}
