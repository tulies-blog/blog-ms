import Base from "./base";
export default class ResourceService extends Base {
  async list(params) {
    // const resp = await this.$curl('/api/api/list', {
    //   params
    // })
    const resp = await this.request("/resource/list", { params });
    return resp;
  }
  async delete(data) {
    const resp = await this.request(`/resource/delete`, {
      method: "POST",
      data,
    });
    return resp;
  }
}
