import os from "os"
import CustomError from "./errorCustom.js";
import { ERRORES } from "./erroresIndice.js";


class ErrorHandlers {

  static argumentosUsuarios(usuario){
    let {nombre, apellido, edad, email, password}=usuario
    return `Se han detectado argumentos faltantes.
Argumentos requeridos:
    - nombre: tipo String. Se ingresó ${nombre}
    - apellido: tipo String. Se ingresó ${apellido}
    - edad: tipo numero entero. Se ingresó ${edad}
    - email: tipo String. Se ingresó ${email}
    - password: tipo String. Se ingresó ${password}

Fecha: ${new Date().toUTCString()}
Usuario: ${os.userInfo().username}
Terminal: ${os.hostname()}`
}
static idInvalido(usuario) {
  let { id } = usuario;
  return `Se ha detectado argumento inválido.
  Argumento requerido:
    - id: tipo id valido de mongoDB. Se ingresó ${id}
  
  Fecha: ${new Date().toUTCString()}
  Usuario: ${os.userInfo().username}
  Terminal: ${os.hostname()}`;
}
static handleFieldError(fieldName, fieldValue, reqData) {
  if (!fieldValue) {
    const error = CustomError.createError({
      name: "Error al crear usuario",
      cause: this.argumentosUsuarios(reqData),
      message: `Complete la propiedad '${fieldName}'`,
      code: ERRORES['ARGUMENTOS_INVALIDOS']
    });
    return error;
  }
}
}

export default ErrorHandlers;