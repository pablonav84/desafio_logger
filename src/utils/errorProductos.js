// errorHandler.js
import os from "os";
import CustomError from "./errorCustom.js";
import { ERRORES } from "./erroresIndice.js";

class ErrorHandler {
  static argumentosProductos(producto) {
    let { title, description, price, thumbnail, code, stock, category, password } = producto;
    return `Se han detectado args inválidos.
    Argumentos requeridos:
        - title: tipo String. Se ingresó ${title}
        - description: tipo String. Se ingresó ${description}
        - price: tipo numero entero. Se ingresó ${price}
        - thumbnail: tipo String. Se ingresó ${thumbnail}
        - code: tipo String. Se ingresó ${code}
        - stock: tipo numero entero. Se ingresó ${stock}
        - category: tipo String. Se ingresó ${category}
        - password: tipo String. Se ingresó ${password}
    
    Fecha: ${new Date().toUTCString()}
    Usuario: ${os.userInfo().username}
    Terminal: ${os.hostname()}`;
  }

  static idInvalido(producto) {
    let { id } = producto;
    return `Se ha detectado argumento inválido.
    Argumentos requeridos:
      - id: tipo id valido de mongoDB. Se ingresó ${id}
    
    Fecha: ${new Date().toUTCString()}
    Usuario: ${os.userInfo().username}
    Terminal: ${os.hostname()}`;
  }

  static handleFieldError(fieldName, fieldValue, reqData) {
    if (!fieldValue) {
      const error = CustomError.createError({
        name: "Error al crear producto",
        cause: ErrorHandler.argumentosProductos(reqData),
        message: `Complete la propiedad '${fieldName}'`,
        code: ERRORES['ARGUMENTOS_INVALIDOS']
      });
      return error;
    }
  }
}

export default ErrorHandler;