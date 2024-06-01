import ProductosController from "../../controller/productos.controller.js";
import { ProductsManager } from "../../dao/productosMongoDAO.js";
import { auth } from "../../middleware/auth.js";
import { passportCall } from "../../utils.js";
import { CustomRouter } from "./router.js";

const productsManager=new ProductsManager()

export class ProductosRouter extends CustomRouter{
    init(){
        this.get("/", passportCall("jwt"), auth(["usuario"]), ProductosController.getProductos)
        this.get("/:id", passportCall("jwt"), auth(["usuario"]), ProductosController.getProductoById)
        this.post("/", passportCall("jwt"), auth(["admin"]), ProductosController.newProducto);
        this.post("/:id", passportCall("jwt"), auth(["admin"]), ProductosController.updateProducto);
        this.delete("/:id", passportCall("jwt"), auth(["admin"]), ProductosController.deleteProducto);
    }
}