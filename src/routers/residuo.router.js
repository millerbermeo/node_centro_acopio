import { Router } from "express";
import { residuoRegistrar, residuoListar, residuoListarId, residuoActualizar, residuoRegistrarSalida, residuoListarMovimientos } from "../controllers/residuo.controller.js";
import { validarToken } from "../controllers/validator.controller.js";

const router = Router();

// router.use(validarToken);


router.get('/listar',validarToken,residuoListar);
router.get('/movimientos',validarToken,residuoListarMovimientos);
router.get('/listar/:id',validarToken,residuoListarId);
router.post('/registrar',validarToken,residuoRegistrar);
router.post('/salida',validarToken,residuoRegistrarSalida);
router.put('/actualizar/:id',validarToken,residuoActualizar);


export default router;