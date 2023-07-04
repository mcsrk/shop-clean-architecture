import { Router } from 'express';

// Repositories
import { ECommerceRepository } from '../infrastructure/repository/ecommerce.repository';
import { ProductRepository } from '../infrastructure/repository/product.repository';

// Use cases
import ProductService from '../use-cases/products';
import EcommerceService from '../use-cases/ecommerce';

// Controllers
import { SearchController } from '../controllers/search.controller';

const route = Router();
/**
 * Initialize repository
 */
const eCommerceRepo = new ECommerceRepository();
const productRepo = new ProductRepository();

/**
 * Initialize use cases
 */
const eCommerceUseCases = new EcommerceService(eCommerceRepo);
const productUseCases = new ProductService(productRepo);

/**
 * Initialize product controller
 */
const productController = new SearchController(eCommerceUseCases, productUseCases);

/**
 * Create routes
 */

route.get(`/:companyPrefix`, productController.searchProductsUsingParams);

export default route;
