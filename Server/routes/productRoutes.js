import express from 'express';
import { 
  getFeaturedProducts,
  getFlashDealProducts,
  getCategories
} from '../controllers/productController.js';

const router = express.Router();

router.get('/featured', getFeaturedProducts);
router.get('/flash-deals', getFlashDealProducts);
router.get('/categories', getCategories);

export default router;
