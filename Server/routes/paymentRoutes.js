import { Router } from 'express';
import { getTiposMetodoPago } from '../controllers/userController.js';

const router = Router();

router.get('/tipos-pago', getTiposMetodoPago);

export default router;
