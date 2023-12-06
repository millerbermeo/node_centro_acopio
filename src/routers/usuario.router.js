import { Router } from "express";
import { listarUsuario, registrarUsuario, usuarioListarId, usuarioActualizar } from "../controllers/usuario.controller.js";
import { validarToken } from "../controllers/validator.controller.js";


const router = Router();
router.get('/listar',validarToken, listarUsuario);
router.get('/listar/:id',validarToken, usuarioListarId);
router.post('/registrar',registrarUsuario);
router.put('/actualizar/:id',validarToken, usuarioActualizar);


// router.get('/listar',validarToken,residuoListar);



export default router;