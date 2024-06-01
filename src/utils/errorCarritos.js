import os from "os";
import CustomError from "./errorCustom.js";
import { ERRORES } from "./erroresIndice.js";

class ErrorHandlers {
  static argumentoCarritos(carrito) {
    let { cid, pid } = carrito;
    return `Se ha detectado argumento inválido o inexistente.
    Argumento requerido:
        - cid: tipo id válido de mongoDB. Se ingresó ${cid}
        - pid: tipo id válido de mongoDB. Se ingresó ${pid}
    
    Fecha: ${new Date().toUTCString()}
    Usuario: ${os.userInfo().username}
    Terminal: ${os.hostname()}`;
  }
  static idInvalido(carrito) {
    let { id } = carrito;
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
        name: "Error al cargar producto",
        cause: ErrorHandlers.argumentoCarritos(reqData),
        message: `Complete la propiedad '${fieldName}'`,
        code: ERRORES['ARGUMENTOS_INVALIDOS']
      });
      return error;
    }
  }
}

export default ErrorHandlers;