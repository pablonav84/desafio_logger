import { ProductsManager as ProductosDAO } from "../dao/productosMongoDAO.js"


class ProductosService{
    constructor(dao){
        this.ProductosDAO=dao
    }

    async getAllProductos(){
        return await this.ProductosDAO.getAll()
    }
    async getProductoBy(id){
        return await this.ProductosDAO.getProductBy(id)
    }
    async crearProducto(producto){
        return await this.ProductosDAO.addProduct(producto)
    }
    async actualizaProducto(id, datosActualizados){
        return await this.ProductosDAO.updateProduct(id, datosActualizados);
    }    
    async delProducto(id){
        return await this.ProductosDAO.deleteProduct({_id:id})
    }
}

export const productosService=new ProductosService(new ProductosDAO())