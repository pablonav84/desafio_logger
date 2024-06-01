import { Router } from 'express';
import UsuariosController from '../../controller/usuariosController.js';
import { CustomRouter } from './router.js';

export const router=Router()


export class UsuariosRouter extends CustomRouter{
    init(){
        this.get('/', UsuariosController.getUsuarios)
        this.get("/dto", UsuariosController.getUsuariosDTO)
        this.get("/:id", UsuariosController.getUsuarioById)
        this.post("/", UsuariosController.create)
    }
}