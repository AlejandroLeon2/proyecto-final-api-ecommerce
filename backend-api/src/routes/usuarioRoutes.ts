import { Router } from 'express';
import { UserControllers } from '../controllers/UsuarioControllers.js';
import { verifyToken, authGuard } from '../middleware/verifyToken.js';
const router = Router();
const controllers = new UserControllers();

router.post('/auth', verifyToken, controllers.autenticarUsuario);
router.get(`/auth/me/rol`, authGuard, controllers.obtenerRolUsuario);
router.get('/usuario/:uid', controllers.obtenerUsuarioPorUid);
export default router;
