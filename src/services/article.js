import BaseService from "./base";
export default class ArticleService extends BaseService {
  async list(params) {
    const resp = await this.request("/articles", { params });
    return resp;
  }
  async delete(id) {
    const resp = await this.request(`/articles/${id}`, {
      method: "DELETE",
    });
    return resp;
  }
  async create(data) {
    const resp = await this.request(`/articles`, {
      method: "POST",
      data,
    });

    return resp;
  }
  async update({ id, ...data }) {
    const resp = await this.request(`/articles/${id}`, {
      method: "PUT",
      data,
    });
    return resp;
  }
  async info(id) {
    const resp = await this.request(`/articles/${id}`);
    return resp;
  }
  async changeStatus(id, status) {
    const resp = await this.request(`/articles/${id}/status/${status}`, {
      method: "PATCH",
    });
    return resp;
  }
}
