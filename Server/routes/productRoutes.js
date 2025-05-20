import express from 'express';
import { 
  getFeaturedProducts,
  getFlashDealProducts,
  getCategories,
  getProductById,
  getProductosRelacionados
} from '../controllers/productController.js';

const router = express.Router();

router.get('/featured', getFeaturedProducts);
router.get('/flash-deals', getFlashDealProducts);
router.get('/categories', getCategories);

// 🚨 Nueva ruta para obtener producto por ID
router.get('/:id', getProductById);
// Nueva ruta backend (productRoutes.js)
router.get('/relacionados/:categoriaId', getProductosRelacionados);


export default router;
