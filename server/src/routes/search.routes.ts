import { Router } from 'express';

// Repositories
import { ExternalProductRepository } from '../infrastructure/repository/ecommerce.repository';
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
const externalProductRepo = new ExternalProductRepository();
const productRepo = new ProductRepository();

/**
 * Initialize use cases
 */
const externalProductUseCase = new EcommerceService(externalProductRepo);
const productUseCase = new ProductService(productRepo);

/**
 * Initialize product controller
 */
const productController = new SearchController(externalProductUseCase, productUseCase);

/**
 * Create routes
 */

route.get(`/:companyPrefix`, productController.searchProductsUsingParams);

export default route;
