import express from 'express';
import { 
  getFeaturedProducts,
  getCategories,
  getProductById,
  getProductosRelacionados,
  getAllProducts,
  getOfertasActivas // ✅ agregado
} from '../controllers/productController.js';

const router = express.Router();

// ⚠️ EL ORDEN ES IMPORTANTE
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/relacionados/:categoriaId/:productoId', getProductosRelacionados);
router.get('/all', getAllProducts);
router.get('/ofertas', getOfertasActivas); // ✅ agregada aquí
router.get('/:id', getProductById); // ← debe ir al final

export default router;
