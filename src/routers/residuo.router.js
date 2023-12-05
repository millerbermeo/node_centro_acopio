import { Router } from "express";
import { residuoRegistrar, residuoListar, residuoListarId, residuoActualizar, residuoRegistrarSalida } from "../controllers/residuo.controller.js";

const router = Router();

router.get('/listar',residuoListar);
router.get('/listar/:id',residuoListarId);
router.post('/registrar',residuoRegistrar);
router.post('/salida',residuoRegistrarSalida);
router.put('/actualizar/:id',residuoActualizar);


export default router;