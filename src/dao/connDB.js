import mongoose from "mongoose"
import { config } from "../config/config.js"
import { logger } from "../utils.js"

export const connDB=mongoose.connect(config.MONGO_URL,{
    dbName: config.DB_NAME
})
logger.info("DB conectada")