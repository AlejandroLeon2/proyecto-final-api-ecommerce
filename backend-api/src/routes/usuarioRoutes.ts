import { Router } from 'express';
import { UserControllers } from '../controllers/UsuarioControllers.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = Router();
const controllers = new UserControllers();

router.post('/auth', verifyToken, controllers.autenticarUsuario);

router.get('/usuario/:uid', controllers.obtenerUsuarioPorUid);

// --- NUEVA RUTA DE REGISTRO ---
// No necesita verifyToken, porque el usuario aún no existe.
router.post('/auth/register', controllers.registrarUsuario);

export default router;