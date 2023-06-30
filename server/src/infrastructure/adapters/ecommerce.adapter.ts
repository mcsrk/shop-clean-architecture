export interface IEcommerceAdapter {
	searchProducts(searchterm: string): Promise<any[]>;
}
