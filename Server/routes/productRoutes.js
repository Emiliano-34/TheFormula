import express from 'express';
import { 
  getFeaturedProducts,
  getFlashDealProducts,
  getCategories,
  getProductById,
  getProductosRelacionados,
  getAllProducts
} from '../controllers/productController.js';

const router = express.Router();

// ⚠️ ESTE ORDEN ES IMPORTANTE
router.get('/featured', getFeaturedProducts);
router.get('/flash-deals', getFlashDealProducts);
router.get('/categories', getCategories);
router.get('/relacionados/:categoriaId/:productoId', getProductosRelacionados); // 👈 DEBE IR ANTES
router.get('/all', getAllProducts);
router.get('/:id', getProductById); // 👈 SIEMPRE AL FINAL


export default router;
