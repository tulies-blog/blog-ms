import Base from "./base";
export default class ResourceService extends Base {
  async list(params) {
    // const resp = await this.$curl('/api/api/list', {
    //   params
    // })
    const resp = await this.request("/resources", { params });
    return resp;
  }
  async delete(id) {
    const resp = await this.request(`/resources/${id}`, {
      method: "DELETE",
    });
    return resp;
  }
}
