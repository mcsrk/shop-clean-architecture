import { Router } from 'express';

// Repositories
import { ECommerceRepository } from '../infrastructure/repository/ecommerce/ecommerce.repository';
import { ProductRepository } from '../infrastructure/repository/product/product.repository';

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
const searchEcommerceController = new SearchController(eCommerceUseCases, productUseCases);

/**
 * Create routes
 */

route.get(`/:companyPrefix`, searchEcommerceController.searchProductsUsingParams);
route.get(`/all/:companyPrefix`, searchEcommerceController.fetchAllProducts);

export default route;
