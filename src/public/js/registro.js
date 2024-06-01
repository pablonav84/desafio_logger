let inputNombre=document.getElementById("nombre")
let inputApellido=document.getElementById("apellido")
let inputEmail=document.getElementById("email")
let inputEdad=document.getElementById("edad")
let inputPassword=document.getElementById("password")
let btnSubmit=document.getElementById("submit")
let divMensaje=document.getElementById("error")

btnSubmit.addEventListener("click", async(e)=>{
    e.preventDefault()

    let body={
        nombre:inputNombre.value,
        apellido:inputApellido.value,
        email:inputEmail.value,
        edad:inputEdad.value,
        password:inputPassword.value
    }

    let resultado=await fetch("/api/sessions/registro",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(body)
    })
    let status=resultado.status
    let datos=await resultado.json()
    if(status==201){
        window.location.href = "/";
    }else{
        divMensaje.style.color="red"
        divMensaje.innerHTML=datos.error
    }
})