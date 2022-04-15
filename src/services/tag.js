import Base from "./base";
export default class TagService extends Base {
  async list(params) {
    const resp = await this.request("/tags", { params });
    return resp;
  }
  async delete(id) {
    const resp = await this.request(`/tags/${id}`, {
      method: "DELETE",
    });
    return resp;
  }

  async create(data) {
    const resp = await this.request(`/tags`, {
      method: "POST",
      data,
    });

    return resp;
  }
  async update({ id, ...data }) {
    const resp = await this.request(`/tags/${id}`, {
      method: "PUT",
      data,
    });
    return resp;
  }
  // async changeStatus(id, status) {
  //   const resp = await this.request(`/tags/${id}/status/${status}`, {
  //     method: "PATCH",
  //   });
  //   return resp;
  // }
}
