import { Request, Response } from 'express';
import { ShopifyAdapter } from '../infrastructure/adapters/shopify/shopify.adapter';
import { VtexAdapter } from '../infrastructure/adapters/vtex/vtex.adapter';

const searchProducts = async (req: Request, res: Response) => {
	const companyPrefix = req.params.companyPrefix;
	console.log('fetching ', companyPrefix);
	try {
		const shopifyClient = new ShopifyAdapter();
		const vtexClient = new VtexAdapter();

		const products = await shopifyClient.searchProducts('ADIDAS - ZAPATILLAS DE TRAIL RUNNING');

		return res.status(201).json({ products });
	} catch (err: any) {
		const message = err.message;
		console.log('[ExternalProductRepo]: ', message);
		throw new Error(`Error getting products: ${message}`);
	}
};

export default { searchProducts };
