import { Router } from "express";
import { ActividadRegistrarUsuarios, actividadTerminada, actividadListar, actividadListarId, actividadActualizar } from "../controllers/actividad.controller.js";
import { validarToken } from "../controllers/validator.controller.js";

const router = Router();

router.get('/listar',validarToken, actividadListar);
router.get('/listar/:id',validarToken, actividadListarId);
router.post('/registrar',validarToken, ActividadRegistrarUsuarios);
router.put('/estado/:id',validarToken, actividadTerminada);
router.put('/actualizar/:id',validarToken, actividadActualizar);

export default router;