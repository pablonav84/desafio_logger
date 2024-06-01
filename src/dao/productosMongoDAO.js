import { productsModelo } from "./models/productosModelo.js";

export class ProductsManager {
  constructor() {}

  async getAll() {
    return await productsModelo.find().lean();
  }
  async getProductById(id) {
    return await productsModelo.findById(id).lean();
  }
  async getProductBy(filtro={}) {
    return await productsModelo.findOne(filtro);
  }
  async addProduct(product) {
    return await productsModelo.create(product);
  }
  async updateProduct(id, modificacion = {}) {
    return await productsModelo.updateOne({ _id: id }, modificacion);
  }
  async deleteProduct(id) {
    return await productsModelo.deleteOne({ _id: id });
  }
}