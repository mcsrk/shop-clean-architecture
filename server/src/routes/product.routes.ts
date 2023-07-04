import { Router } from 'express';

// Repositories
import { ProductRepository } from '../infrastructure/repository/product.repository';

// Use cases
import ProductService from '../use-cases/products';

// Controllers
import { ProductController } from '../controllers/product.contoller';

const route = Router();
/**
 * Initialize repository
 */
const productRepo = new ProductRepository();

/**
 * Initialize use cases
 */
const productUseCase = new ProductService(productRepo);

/**
 * Initialize product controller
 */
const productController = new ProductController(productUseCase);

/**
 * Create routes
 */

route.get(`/`, productController.selectOwnProductsUsingParams);

export default route;
