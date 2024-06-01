import passport from "passport"
import local from "passport-local"
import passportjwt from "passport-jwt"
import bcrypt from 'bcrypt'
import { generaHash, logger } from "../utils.js"
import { rolModelo } from "../dao/models/rolModelo.js"
import { usuarioModelo } from "../dao/models/usuariosModelo.js"
import { usuariosMongoDAO } from "../dao/usuariosMongoDAO.js"
import { CarritosDAO } from "../dao/carritosDAO.js"
import { config } from "./config.js"
import github from "passport-github2"

const buscaToken=(req)=>{
    let token=null

    if(req.signedCookies.coderCookie){
        token=req.signedCookies.coderCookie
    }
    return token
}

export const initPassport=()=>{
    const manager = new usuariosMongoDAO();
    const carritosDAO= new CarritosDAO();
    passport.use(
        "jwt",
        new passportjwt.Strategy(
            {
                secretOrKey: config.SECRET,
                jwtFromRequest: new passportjwt.ExtractJwt.fromExtractors([buscaToken])
            },
            async (contenidoToken, done)=>{
                try {
                    return done(null, contenidoToken)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use(
        "github",
        new github.Strategy(
            {
                clientID:"Iv1.456520ac1405607b",
                clientSecret:"f5a51c2c06bef393f99b4372f5b497a82fd76a76",
                callbackURL:"http://localhost:8080/api/sessions/callbackGithub",
            },
            async function(accessToken, refreshToken, profile, done){
                try {
                     let nombre=profile._json.name
                    let email=profile._json.email
                    if(!email){
                        return done(null, false)
                    }
                    let usuario= await usuarioModelo.findOne({email})
                    if(!usuario){
                        usuario=await usuarioModelo.create({
                            nombre, email, 
                            profileGithub: profile
                        })
                    }

                    return done(null, usuario)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use(
        "registro",
        new local.Strategy(
            {
                usernameField:"email",
                passReqToCallback: true
            },
            async (req, username, password, done)=>{
                try {
                    let {nombre}=req.body
                    if(!nombre){
                        return done(null, false, {message:"Complete nombre"})
                    }
                    let {apellido}=req.body
                    if(!apellido){
                        return done(null, false, {message:"Complete apellido"})
                    }
                    let {edad}=req.body
                    if(!edad){
                        return done(null, false, {message:"Complete edad"})
                    }
                    let existe=await usuarioModelo.findOne({email:username})
                    if(existe){
                        logger.warning(`Ya existe un usuario registrado con el email ${username}`)
                        return done(null, false, {message:`Ya existe un usuario registrado con el email ${username}`})
                    }

                    password=generaHash(password)

                    let rol=await rolModelo.create({descrip:"usuario"})
                    rol:rol._id

                    let cart=await carritosDAO.create()
                    cart:cart._id

                    let usuario=await usuarioModelo.create({
                        nombre, apellido, email:username, edad, password, rol, cart
                    })
                    return done(null, usuario)

                } catch (error) {
                    return done(error, false, {message:"error al crear registro"})
                }
            }
        )
    )

    passport.use(
        "login",
        new local.Strategy(
          {
            usernameField: "email"
          },
          async (username, password, done) => {
            if (!{email:username} || !password) {
                let error = "Por favor, ingresa el nombre de usuario y la contraseña";
                return done(null, false, { message: error });
              }
            try {
              let usuario = await manager.getBy({ email: username });
              
              if (!usuario) {
                logger.warning("Correo incorrecto o no encontrado")
                return done(null, false, { message: "Correo electrónico incorrecto o no encontrado" });
              }
              //bcrypt.compare para comparar la contraseña proporcionada con la contraseña almacenada
              const passwordMatch = await bcrypt.compare(password, usuario.password);
              if (!passwordMatch) {
                logger.error("contraseña incorrecta")
                return done(null, false, { message: "Contraseña incorrecta" });
              }
              return done(null, usuario);
            } catch (error) {
                logger.fatal("Error al autenticar el usuario", error)
              return done(error, false, { message: "Error al autenticar el usuario" });
            }
          }
        )
      );   
}