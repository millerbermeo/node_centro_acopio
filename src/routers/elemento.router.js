import { Router } from "express";
import { elementoRegistrar, elementoListar, elementoListarId, elementoActualizar, elementoEliminar } from "../controllers/elementos.controller.js";
const router = Router();

router.get('/listar', elementoListar);
router.get('/listar/:id', elementoListarId);
router.post('/registrar', elementoRegistrar);
router.put('/actualizar/:id', elementoActualizar);
router.delete('/eliminar/:id', elementoEliminar);


export default router;