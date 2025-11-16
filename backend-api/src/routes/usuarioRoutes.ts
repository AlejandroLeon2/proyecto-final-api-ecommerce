import { Router } from 'express';
import { UserControllers } from '../controllers/UsuarioControllers.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = Router();
const controllers = new UserControllers();

router.post('/auth', verifyToken, controllers.autenticarUsuario);

router.get('/usuario/:uid', controllers.obtenerUsuarioPorUid);
export default router;