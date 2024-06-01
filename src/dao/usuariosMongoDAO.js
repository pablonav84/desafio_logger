import { UsuariosDTO } from "../DTO/usuariosDTO.js";
import { usuarioModelo } from "./models/usuariosModelo.js";


export class usuariosMongoDAO{
    constructor(){}

    async getAll(filtro={}){
        const usuarios = await usuarioModelo.find(filtro).populate('cart').populate('rol').lean()
        return  usuarios
    }

    async getDTO(){
        const usuarios = await usuarioModelo.find();
        const usuariosDTO = usuarios.map(usuario => new UsuariosDTO(usuario));
        return usuariosDTO;
    }

    async getBy(filtro={}){
        return await usuarioModelo.findOne(filtro).lean()
    }

    async create(usuario){
         let nuevoUsuario = await usuarioModelo.create(usuario)
        return nuevoUsuario.toJSON()
    }

    async validarEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; //Uso expresiones regulares
        return emailRegex.test(email);
    }    

    async validarPassword(password) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
        return passwordRegex.test(password);
    }
}