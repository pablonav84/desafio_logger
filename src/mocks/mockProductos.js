import {fa, faker} from "@faker-js/faker"


export const generaProducto=()=>{
    let id=faker.database.mongodbObjectId()
    let code = faker.number.int({ min: 10000000, max: 99999999 })
    let descrip=faker.commerce.product()
    let precio=faker.commerce.price({min:1300, max:7480})
    let stock=faker.number.int({min:0, max:800})
    let producto = {
        id, code, descrip, precio, stock
    }
    return producto
}