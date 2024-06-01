import { usuarioModelo } from "../dao/models/usuariosModelo.js";

export const auth = (accesos = []) => {
    return async (req, res, next) => {
        accesos = accesos.map(a => a.toLowerCase());

        try {
            const usuario = await usuarioModelo.findById(req.user._id).populate('rol').lean();
            const rolUsuario = usuario.rol.descrip;

            if (rolUsuario === "admin" || accesos.includes(rolUsuario)) {
                next();
            } else {
                res.setHeader('Content-Type', 'application/json');
                return res.status(403).json({ error: `No tiene privilegios suficientes para acceder al recurso` });
            }
        } catch (error) {
            console.error(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error al procesar la solicitud` });
        }
    }
}