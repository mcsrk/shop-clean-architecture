import { Router } from 'express';

import { ProductRepository } from '../infrastructure/repository/product.repository';
import { ProductService } from '../use-cases/products/index';
import { ProductController } from '../controllers/product.contoller';
import { ExternalProductRepository } from '../infrastructure/repository/ecommerce.repository';
import EcommerceService from '../use-cases/ecommerce';

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
const productController = new ProductController(externalProductUseCase, productUseCase);

/**
 * Create routes
 */

route.get(`/:companyPrefix`, productController.searchProductsUsingParams);

export default route;
