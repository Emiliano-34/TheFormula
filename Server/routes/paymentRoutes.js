import { Router } from 'express';
import { getTiposMetodoPago, deleteMetodoPagoByUserId } from '../controllers/userController.js';

const router = Router();

router.get('/tipos-pago', getTiposMetodoPago);
router.delete('/users/:id/pago/:idMetodo', deleteMetodoPagoByUserId); // ✅ Actualizada

export default router;
