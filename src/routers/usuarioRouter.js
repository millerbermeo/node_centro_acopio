import { Router } from "express";
import { listarUsuario, registrarUsuario, usuarioListarId, usuarioActualizar } from "../controllers/usuario.controller.js";

const router = Router();
router.get('/listar',listarUsuario);
router.get('/listar/:id',usuarioListarId);
router.post('/registrar',registrarUsuario);
router.put('/actualizar/:id',usuarioActualizar);




export default router;