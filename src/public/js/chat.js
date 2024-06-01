Swal.fire({
    title: "Bienvenido al chat",
    input: "text",
    text: "Por favor ingrese su nickname",
    inputValidator: (value) => {
      return !value && "Debe ingresar un nombre...!!!"
    },
    allowOutsideClick: false
  }).then((datos) => {
    console.log(datos)
    let nombre = datos.value
    document.title = nombre

    let inputMsj = document.getElementById("mensaje")
    let divMsjs = document.getElementById("mensajes")
    let btnEnviar = document.getElementById("enviarMensaje")
    inputMsj.focus()

    const socket = io()
    socket.emit("confirmacion", nombre)

    socket.on("historial", (mensajes) => {
      mensajes.forEach((m) => {
        divMsjs.innerHTML += `<div class="mensaje"><strong>${m.nombre}</strong> dice: <i>${m.mensaje}</i></div><br>`
      })
    })

    socket.on("nuevoUsuario", (nombre) => {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${nombre} se ha conectado al chat`,
        showConfirmButton: false,
        timer: 3000
      })
    })

    socket.on("nuevoMensaje", (nombre, mensaje) => {

      divMsjs.innerHTML += `<div class="mensaje"><strong>${nombre}</strong> dice: <i>${mensaje}</i></div><br>`
    })

    socket.on("saleUsuario", (nombre) => {
      divMsjs.innerHTML += `<div class="mensaje"><strong>${nombre}</strong> ha salido del chat... :(</div><br>`
    })

    inputMsj.addEventListener("keyup", (e) => {
      e.preventDefault()
      if (e.code === "Enter" && e.target.value.trim().length > 0) {
        socket.emit("mensaje", nombre, e.target.value.trim())
        e.target.value = ""
        e.target.focus()
      }
    })

    btnEnviar.addEventListener("click", async () => {
      const mensaje = inputMsj.value.trim()
      if (mensaje.length > 0) {
        socket.emit("mensaje", nombre, mensaje)
        inputMsj.value = ""
        inputMsj.focus()
      }
    })

    socket.on('saludo', (datos) => {
      console.log(`${datos.emisor} dice: "${datos.mensaje}"`)
    })
  })