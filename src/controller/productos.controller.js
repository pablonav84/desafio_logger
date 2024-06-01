import mongoose, { isValidObjectId } from "mongoose";
import { generaHash } from "../utils.js";
import { productosService } from "../services/productos.service.js";
import ErrorHandler from "../utils/errorProductos.js";
import { ERRORES } from "../utils/erroresIndice.js";
import CustomError from "../utils/errorCustom.js";


export default class ProductosController {

  static getProductos = async (req, res) => {
    let productos = await productosService.getAllProductos();

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ productos });
  };

  static getProductoById = async (req, res) => {
    try {
      let { id } = req.params;
      if (!isValidObjectId(id)) {
        req.logger.error(`id invalido`)
        throw CustomError.createError({
          name: "Id Inválido",
          cause: ErrorHandler.idInvalido(req.params),
          message: `Ingrese un Id de Mongo Válido`,
          code: ERRORES['BAD REQUEST']
        });
      }
  
      let producto = await productosService.getProductoBy({ _id: id });
  
      if (!producto) {
        req.logger.error(`Id Inexistente`)
          throw CustomError.createError({
            name: "Id Inexistente",
            message: "El Id ingresado pertenece a un producto inexistente",
            code: ERRORES['NOT FOUND']
          });
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ producto });
    } catch (error) {
      req.logger.fatal(error.message)
      return res.status(500).json({ error: error.message, cause: error.cause });
    }
  };
  

  static newProducto = async (req, res) => {
    let {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
      password,
    } = req.body;
    
    try {
      ErrorHandler.handleFieldError('title', title, req.body);
      ErrorHandler.handleFieldError('description', description, req.body);
      ErrorHandler.handleFieldError('price', price, req.body);
      ErrorHandler.handleFieldError('thumbnail', thumbnail, req.body);
      ErrorHandler.handleFieldError('code', code, req.body);
      ErrorHandler.handleFieldError('stock', stock, req.body);
      ErrorHandler.handleFieldError('category', category, req.body);
      ErrorHandler.handleFieldError('password', password, req.body);

    let existCode = await productosService.getProductoBy({ code });
    if (existCode) {
      req.logger.warning(`Código Existente en BD`)
      CustomError.createError({
        name: "Código Existente en BD",
        message: `Ya existe un producto con el mismo código`,
        code: ERRORES['CODIGO_EXISTENTE']
      });
      return;
    }
    password = generaHash(password);

      let nuevoProducto = await productosService.crearProducto({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        password,
      });
      res.setHeader("Content-Type", "application/json");
      return res.status(201).json({ nuevoProducto: nuevoProducto });
    } catch (error) {
      req.logger.fatal('Error Indeterminado', error.name);
      (error.name === "Error al crear producto")
        return res.status(500).json({
          error: error.name,
          cause: error.cause,
          message: error.message,
          code: error.code
        });
    }
  };

  static updateProducto = async (req, res) => {
    let { id } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        req.logger.error(`Id Inválido`);
        throw CustomError.createError({
          name: "Id Inválido",
          cause: ErrorHandler.idInvalido(req.params),
          message: `Ingrese un Id Válido`,
          code: ERRORES['BAD REQUEST']
        });
      }
  
      let upDate = req.body;
      if (upDate._id) {
        delete upDate._id;
      }
  
      if (upDate.code) {
        let existe = await productosService.getProductoBy({ code: upDate.code });
        if (existe) {
          req.logger.warning(`Código Existente en BD`);
          throw CustomError.createError({
            name: "Código Existente en BD",
            cause: ErrorHandler.argumentosProductos(req.body),
            message: `Ya existe un producto con code ${upDate.code}`,
            code: ERRORES['CODIGO_EXISTENTE']
          });
        }
      }
  
      if (upDate.password) {
        upDate.password = generaHash(upDate.password);
      }
  
      let resProduct = await productosService.actualizaProducto(id, upDate);
      if (resProduct.modifiedCount > 0) {
        res.status(200).json({ message: `Producto con id ${id} modificado` });
      } else {
        req.logger.error(`Producto Inexistente`);
        throw CustomError.createError({
          name: "Producto Inexistente",
          message: `No existen productos con id ${id}`,
          code: ERRORES['NOT FOUND']
        });
      }
    } catch (error) {
      req.logger.fatal(`Error Indeterminado`, error);
      return res.status(500).json({ error: error.message, cause: error.cause, code: error.code });
    }
  };
  
  static deleteProducto = async (req, res) => {
    let { id } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        req.logger.error(`Id Invalido`);
        throw CustomError.createError({
          name: "invalido",
          cause: ErrorHandler.idInvalido(req.params),
          message: `Id invalido`,
          code: ERRORES['BAD REQUEST']
        });
      }
  
      let resProduct = await productosService.delProducto(id);
      if (resProduct.deletedCount > 0) {
        res.status(200).json({ message: `Producto con id ${id} eliminado` });
      } else {
        req.logger.error(`Producto Inexistente`);
        throw CustomError.createError({
          name: "Id Inexistente",
          message: "El Id ingresado pertenece a un producto inexistente",
          code: ERRORES['NOT FOUND']
        });
      }
    } catch (error) {
      req.logger.fatal(`Error Indeterminado`);
      return res.status(500).json({ error: error.message, cause: error.cause, code: error.code });
    }
  }
}