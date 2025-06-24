import express from 'express';
import { actualizarInventario } from '../controllers/inventarioController.js';

const router = express.Router();

router.put('/', actualizarInventario);

export default router;
