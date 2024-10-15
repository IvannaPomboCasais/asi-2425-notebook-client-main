import HTTP from "../common/http";

const resource = "users";

export default {
  async getAll() {
    return (await HTTP.get(`${resource}`)).data;
  },

  async activate(id) {
    return (await HTTP.put(`${resource}/${id}/active`)).data;
  },

  async deactivate(id) {
    return await HTTP.delete(`${resource}/${id}/active`);
  },

  async delete(id) {
    return await HTTP.delete(`${resource}/${id}`);
  }
};
