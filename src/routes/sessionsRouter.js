import { Router } from 'express';
import jwt from "jsonwebtoken";
import { passportCall } from '../utils.js';
import { usuarioModelo } from '../dao/models/usuariosModelo.js';
import { auth } from '../middleware/auth.js';
import { config } from '../config/config.js';
import { UsuariosDTO } from '../DTO/usuariosDTO.js';

export const router=Router()

router.get('/current', passportCall("jwt"), auth(["usuario", "admin"]), async (req, res) => {
  try {
    let usuario = await usuarioModelo.findById(req.user._id).populate('rol').lean();
    const rolUsuario = usuario.rol.descrip;
    const usuarioDTO = new UsuariosDTO(usuario);

    if (rolUsuario === "admin") {
      // Lógica para acciones de administrador (crear, actualizar, eliminar productos)
      // ...
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        mensaje: 'Perfil de administrador',
        datosUsuario: usuarioDTO
      });
    } else if (rolUsuario === "usuario") {
      // Lógica para acciones de usuario (enviar mensajes al chat, agregar productos al carrito)
      // ...
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        mensaje: 'Perfil de usuario',
        datosUsuario: usuarioDTO
      });
    }
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el perfil del usuario' });
  }
});


router.get("/usuarios", async(req, res)=>{
    try {
        let usuarios = await usuarioModelo.find().populate("rol").populate("cart").lean();
        
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ usuarios });
      } catch (error) {
        req.logger.error(`Error Indeterminado`, error);
        res.status(500).json({ mensaje: 'Error al obtener los usuarios' });
      }
})

router.post("/registro", passportCall("registro"), (req, res)=>{
  
  let usuario=req.user
    res.setHeader('Content-Type','application/json');
    return res.status(201).json({status:"registro correcto", usuario});
})

router.post('/login', passportCall("login"), async(req,res)=>{

    let usuario=req.user;
    usuario={...usuario};
    delete usuario.password;

    let token=jwt.sign(usuario, config.SECRET, {expiresIn:"1h"});

    res.cookie("coderCookie", token, {maxAge: 1000*60*60, signed:true, httpOnly: true});

    res.setHeader('Content-Type','application/json');
    res.status(200).json({
        message:"Login correcto", usuario
    });
});

router.get('/logout', (req, res) => {
  
  // Elimina la cookie de autenticación
  res.clearCookie('coderCookie');

  // Envía una respuesta al cliente
  res.send('<script>alert("Logout exitoso"); window.location.href="/?mensaje=Logout exitoso";</script>');
});

//Login con Github
router.get('/github', passportCall("github"), (req,res)=>{})

router.get('/callbackGithub', passportCall("github", {failureRedirect:"/api/sessions/errorGitHub"}), (req,res)=>{

  req.usuario=req.user
  res.setHeader('Content-Type','application/json');
  return res.status(200).json({
      payload:"Login correcto", 
      usuario:req.user
  });
})

router.get("/errorGitHub", (req, res)=>{
  res.setHeader('Content-Type','application/json');
  return res.status(500).json(
      {
          error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
          detalle:`Fallo al autenticar con GitHub`
      }
  )
})