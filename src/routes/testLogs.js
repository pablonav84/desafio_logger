import { Router } from "express";

export const router = Router()

router.get('/loggertest', (req, res) => {
    
    req.logger.fatal('Este es un mensaje de nivel fatal');
    req.logger.error('Este es un mensaje de nivel error');
    req.logger.warning('Este es un mensaje de nivel advertencia');
    req.logger.info('Este es un mensaje de nivel información');
    req.logger.http('Este es un mensaje de nivel http');
    req.logger.debug('Este es un mensaje de nivel depuración');
    res.send('Logs probados exitosamente');
  });