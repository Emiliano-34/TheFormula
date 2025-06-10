import express from 'express';
import { 
  getFeaturedProducts,
  getCategories,
  getProductById,
  getProductosRelacionados,
  getAllProducts,
  getOfertasActivas,
  searchProducts,
  createProduct  // Importa la función para crear producto
} from '../controllers/productController.js';

const router = express.Router();

// ⚠️ EL ORDEN ES IMPORTANTE
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/relacionados/:categoriaId/:productoId', getProductosRelacionados);
router.get('/all', getAllProducts);
router.get('/ofertas', getOfertasActivas);
router.get('/search', searchProducts); 
router.get('/:id', getProductById);

// Ruta para crear un producto nuevo
router.post('/', createProduct);

export default router;
