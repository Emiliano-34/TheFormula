// Server/routes/userRoutes.js
import { loginUser, registerUser, crearAdmin, getUserById, updateUserProfile, getDireccionByUserId, saveDireccion, updateDireccionByUserId, getMetodoPagoByUserId, updateMetodoPagoByUserId} from '../controllers/userController.js';
import { Router } from 'express';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/crear-admin', crearAdmin);

// NUEVAS RUTAS:
router.get('/:id/direccion', getDireccionByUserId);
router.put('/:id/direccion', updateDireccionByUserId); // si tienes una para guardar

router.get('/:id', getUserById);
router.put('/:id', updateUserProfile);

router.get('/:id/pago', getMetodoPagoByUserId);
router.put('/:id/pago', updateMetodoPagoByUserId);


export default router;
