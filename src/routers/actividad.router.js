import { Router } from "express";
import { ActividadRegistrarUsuarios } from "../controllers/actividad.controller.js";

const router = Router();

router.post('/registrar',ActividadRegistrarUsuarios);

export default router;