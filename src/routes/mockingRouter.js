import { Router } from "express";
import ProductManager from "../dao/productosMockDAO.js";


export const router = Router()
const pm = new ProductManager()

router.get('/mockingproducts', async (req, res) => {
    const productos = await pm.cienProductos();
    res.json(productos);
  });

  router.get('/productosfs', async (req, res) => {
    const productos = await pm.obtenerProductos();
    res.json(productos);
  });