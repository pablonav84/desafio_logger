import fs from "fs/promises";
import { generaProducto } from "../mocks/mockProductos.js";


class ProductManager {
  constructor() {
  }

  async cienProductos() {
    const productos = [];
    for (let i = 0; i < 100; i++) {
      const producto = generaProducto();
      productos.push(producto);
    }
    try {
      await fs.writeFile('./src/data/productos.json', JSON.stringify(productos, null, 5), 'utf8');
      console.log('Productos almacenados en productos.json');
    } catch (err) {
      console.error('Error al escribir en el archivo', err);
    }
    return productos;
  }

  async obtenerProductos() {
    try {
      const data = await fs.readFile('./src/data/productos.json', 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error al leer el archivo de productos', err);
      return [];
    }
  }

  async obtenerProductoPorCode(code) {
    try {
      const productos = await this.obtenerProductos();
      
      const productoEncontrado = productos.find(producto => producto.code == code);
      
      return productoEncontrado || null;
    } catch (err) {
      console.error('Error al obtener el producto por código', err);
      return null;
    }
  }

  async crearProducto(code, descrip, precio, stock) {
    const nuevoProducto = {
      code,
      descrip,
      precio,
      stock
    };
    try {
      const productosExistentes = await this.obtenerProductos();
      productosExistentes.push(nuevoProducto);
      await fs.writeFile('./src/data/productos.json', JSON.stringify(productosExistentes), 'utf8');
      console.log('Nuevo producto creado y almacenado en productos.json');
    } catch (err) {
      console.error('Error al escribir en el archivo', err);
    }
    return nuevoProducto;
  }
}

export default ProductManager;