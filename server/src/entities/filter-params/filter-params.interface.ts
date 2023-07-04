/** Params to list own products*/
export interface IFilterParams {
	search_text?: string;
	price?: number;
	/** Sequelize possible operators for price field:
	 *  low than  | low than equal  | equal | greater than equal | greater than
	 * */
	price_operator?: 'lt' | 'lte' | 'eq' | 'gte' | 'gt' | undefined;
}
