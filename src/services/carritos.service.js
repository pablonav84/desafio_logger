import { CarritosDAO } from "../dao/carritosDAO.js"

class CarritosService{
    constructor(dao){
        this.CarritosDAO=dao
    }
    async getCarts(){
        return await this.CarritosDAO.getAll()
    }
    async getCartsById(id){
        return await this.CarritosDAO.getById(id)
    }
    async getCartBy(filtro){
        return await this.CarritosDAO.getOneBy(filtro)
    }
    async getCartByPopulate(filtro){
        return await this.CarritosDAO.getOneByPopulate(filtro);
    }    
    async createCart(id){
        return await this.CarritosDAO.create({productos})
    }
    async updateCart(id, modificacion){
        return await this.CarritosDAO.update(id, modificacion)
    }
}

export const carritosService=new CarritosService(new CarritosDAO())