import { config } from "../config/config.js";
export let DAO

switch (config.PERSISTENCE) {
    case "MONGO":
        await import("./connDB.js")
        DAO=(await import("./usuariosMongoDAO.js")).usuariosMongoDAO
        break;

    case "FS":
        DAO=(await import("./usuariosFsDAO.js")).usuariosFsDAO
        break;

    default:
        console.log(`Persistencia mal configurada...!!!`)
        process.exit()
        break;
}