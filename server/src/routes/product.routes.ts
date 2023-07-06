import { Router } from 'express';

// Repositories
import { ProductRepository } from '../infrastructure/repository/product/product.repository';

// Use cases
import ProductService from '../use-cases/products';

// Controllers
import { ProductController } from '../controllers/product.contoller';

const route = Router();
/**
 * Initialize repository
 */
const productRepository = new ProductRepository();

/**
 * Initialize use cases
 */
const productUseCases = new ProductService(productRepository);

/**
 * Initialize product controller
 */
const productController = new ProductController(productUseCases);

/**
 * Create routes
 */

route.get(`/`, productController.selectOwnProductsUsingParams);

export default route;
