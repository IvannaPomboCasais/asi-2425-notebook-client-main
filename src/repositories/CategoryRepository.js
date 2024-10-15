import HTTP from "@/common/http";

const resource = "categories";

export default {
  async findAll() {
    return (await HTTP.get(resource)).data;
  },

  async findOne(id) {
    return (await HTTP.get(`${resource}/${id}`)).data;
  },

  async save(category) {
    if (category.id) {
        return (await HTTP.put(`${resource}/${category.id}`, category)).data;
    } else {
      return (await HTTP.post(resource, category)).data;
    }
  },

  async delete(id) {
    return await HTTP.delete(`${resource}/${id}`);
  }
};
