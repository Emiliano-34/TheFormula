// Server/routes/userRoutes.js
import { loginUser, registerUser, crearAdmin, getUserById, updateUserProfile } from '../controllers/userController.js';
import { Router } from 'express';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/crear-admin', crearAdmin);

// NUEVAS RUTAS:
router.get('/:id', getUserById);
router.put('/:id', updateUserProfile);

export default router;
