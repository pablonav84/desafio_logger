import { isValidObjectId } from "mongoose";
import { carritosService } from "../services/carritos.service.js";
import { productosService } from "../services/productos.service.js";
import { usuariosService } from "../services/usuarios.service.js";
import Ticket from "../dao/models/ticketModelo.js";
import ErrorHandlers from "../utils/errorCarritos.js";
import CustomError from "../utils/errorCustom.js";
import { ERRORES } from "../utils/erroresIndice.js";


export default class CarritosController {
  static getCart = async (req, res) => {
    let { cid } = req.params;
  
    try {
      if (!isValidObjectId(cid)) {
        req.logger.error(`Id Inválido`);
        throw CustomError.createError({
          name: "Id Inválido",
          cause: ErrorHandlers.idInvalido(req.params),
          message: "Ingrese cid con formato válido de MongoDB id",
          code: ERRORES['ARGUMENTOS INVALIDOS']
        });
      }
  
      let carrito = await carritosService.getCartBy({ _id: cid });
      if (!carrito) {
        req.logger.error(`Id Inexistente`);
        throw CustomError.createError({
          name: "Id Inexistente",
          cause: ErrorHandlers.argumentoCarritos(req.params),
          message: "El Id ingresado no se encuentra en la BD",
          code: ERRORES['NOT FOUND']
        });
      }
  
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ carrito });
    } catch (error) {
      req.logger.fatal(`Error Indeterminado`, error);
      return res.status(500).json({ 
        name: error.name,
        cause: error.cause,
        message: error.message,
        code: error.code
      });
    }
  };
  

  static getProductToCart = async (req, res) => {

    try {
    let { cid, pid } = req.params;

  if (!isValidObjectId(cid)) {
    req.logger.error(`Id Carrito Inválido`);
    throw CustomError.createError({
      name: "cid Inválido",
      cause: ErrorHandlers.argumentoCarritos(req.params),
      message: "Ingrese cid válido",
      code: ERRORES['ARGUMENTOS INVALIDOS']
    });
  }
  if (!isValidObjectId(pid)) {
    req.logger.error(`Id Producto Inválido`);
    throw CustomError.createError({
      name: "pid Inválido",
      cause: ErrorHandlers.argumentoCarritos(req.params),
      message: "Ingrese pid válido",
      code: ERRORES['ARGUMENTOS INVALIDOS']
    });
  }

  let carrito = await carritosService.getCartBy({ _id: cid });

  if (!carrito) {
    req.logger.error(`Carrito Inexistente`);
    throw CustomError.createError({
      name: "carrito inexistente",
      message: "El Id ingresado es inexistente",
      code: ERRORES['NOT FOUND']
    });
  }

  let producto = await productosService.getProductoBy({ _id: pid });
  if (!producto) {
    req.logger.error(`Producto Inexistente`);
    throw CustomError.createError({
      name: "producto inexistente",
      message: "El Id ingresado es inexistente",
      code: ERRORES['NOT FOUND']
    });
  }

  let indiceProducto = carrito.items.findIndex((p) => p.productId.equals(pid));
  if (indiceProducto !== -1) {
    carrito.items[indiceProducto].cantidad++;
  } else {
    carrito.items.push({ productId: pid, cantidad: 1 });
  }

    let resultado = await carritosService.updateCart(cid, carrito);

    if (resultado.modifiedCount > 0) {
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ payload: "Carrito actualizado...!!!" });
    } else {
      req.logger.error(`Error Indeterminado`);
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: 'Error inesperdo en el servidor',
        code: ERRORES['INDETERMINADO']
      });
    }
  } catch (error) {
    (error.name === "CustomError")
    req.logger.error(`Error Indeterminado`, error);
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: error.name,
        cause: error.cause,
        message: error.message,
        code: error.code
      });
  }
  };

  static purchase = async (req, res) => {
    try {
        let carritoId = req.params.cid;
        let carrito = await carritosService.getCartsById(carritoId);
    
        let totalAmount = 0;
        let productosComprados = [];
        let productosSinStock = [];
    
        // Obtengo los datos del carrito (productos y cantidad), luego recorro el producto para extraer stock y precio
        // compruebo que exista stock disponible y agrego los productos en los arrays inicializados de acuerdo a su stock
        for (const item of carrito.items) {
          let productoId = item.productId;
          let cantidad = item.cantidad;
    
          let producto = await productosService.getProductoBy(productoId);
          
          let stock = producto.stock;
          let price = producto.price;
    
          if (stock >= cantidad) {
            producto.stock -= cantidad;
            await producto.save();
    
            totalAmount += price * cantidad;
            productosComprados.push(item);
          } else {
            productosSinStock.push(item); 
          }
        }
    
    // Los productos que no tienen stock son devueltos al carrito
        carrito.items = productosSinStock;
        await carritosService.updateCart(carritoId, carrito);
    
        // Creo un code único para agregar al ticket con una longitud de 6 caracteres 
        function generateCode() {
          const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          const codeLength = 6;
        
          let code = "";
          for (let i = 0; i < codeLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
          }
          return code;
        }
        
        //Recorro el modelo de usuarios para obtener el email del usuario
        let usuario = await usuariosService.getUsuarioById({_id: req.user._id});
        let email = usuario.email;
    
        //Si hay productos con stock dentro del carrito se genera el ticket
        if (productosComprados.length > 0) {
          const ticketData = {
            code: generateCode(),
            created_at: new Date(),
            amount: totalAmount, 
            purchaser: email,
          };
    
          //Almaceno el ticket en la base de datos
          const newTicket = new Ticket(ticketData);
          console.log(newTicket);
          await newTicket.save();
    
          let message = `Compra finalizada exitosamente con código de compra: ${newTicket.code}`;
          if (productosSinStock.length > 0) {
            message += `. Algunos productos no tenían suficiente stock y no fueron agregados a su compra.`;
          }
          res.status(200).json({ message: message });
        } else {
          req.logger.error(`No pudo Finalizar La Compra`);
          res.setHeader('Content-Type','application/json');
          return res.status(400).json
            ({
              error: "No pudo finalizar la compra",
              message: "No hay productos en el carrito o stock disponible.",
              code: ERRORES["BAD REQUEST"]
            })
        }
      } catch (error) {
        req.logger.error(`Error Indeterminado`, error);
        res.status(500).json({
          error: error.error,
          cause: error.cause,
          message: "Error inesperado en el servidor", 
          code: error.code
        })
      }
  };
}