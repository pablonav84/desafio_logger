export class UsuariosDTO{
    constructor(usuario){
        this.firstName=usuario.nombre.toUpperCase()
        this.lastName=usuario.apellido?usuario.apellido.toUpperCase():" no especificado "
        this.email=usuario.email
        this.cart=usuario.cart
        this.rol=usuario.rol
        if(usuario.apellido){
            this.fullName=this.firstName+" "+this.lastName
        }else{
            this.fullName=this.firstName
        }
    }
}