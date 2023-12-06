import { Router } from "express";
import { ActividadRegistrarUsuarios, actividadTerminada, actividadListar, actividadListarId, actividadActualizar } from "../controllers/actividad.controller.js";


const router = Router();

router.get('/listar', actividadListar);
router.get('/listar/:id', actividadListarId);
router.post('/registrar', ActividadRegistrarUsuarios);
router.put('/estado/:id', actividadTerminada);
router.put('/actualizar/:id', actividadActualizar);

export default router;