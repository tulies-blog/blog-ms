import BaseService from "./base";
export default class CategoryService extends BaseService {
  async tree(params) {
    const resp = await this.request("/categorys/tree", { params });
    return resp;
  }
}
