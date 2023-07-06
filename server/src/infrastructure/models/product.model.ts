import { DataTypes, Model, Optional } from 'sequelize';

// Database instance
import { sequelize } from '../database/database';

// Interfaces
import { IProduct } from '../../entities/product/product.interface';

type ProductPostCreationAttributes = Optional<IProduct, 'product_id'>;

class ProductModel extends Model<IProduct, ProductPostCreationAttributes> implements IProduct {
	public product_id!: string;
	public parent_id!: string | null;
	public init!: boolean;
	public external_id!: string;
	public search_text!: string;
	public name!: string;
	public price!: number;
	public image!: string;
	public json_product!: object;
	public sku!: string;
	public store_product_id!: string;

	/** Data tracking */
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
	public readonly deletedAt!: Date;
	// Definición de las asociaciones del modelo
	static associate() {
		ProductModel.hasMany(ProductModel, { foreignKey: 'parent_id', as: 'variants' });
		ProductModel.belongsTo(ProductModel, { foreignKey: 'parent_id', as: 'main_product' });
	}
}

ProductModel.init(
	{
		product_id: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false,
		},
		parent_id: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		init: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		external_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		search_text: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		price: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		image: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		json_product: {
			type: DataTypes.JSONB,
			allowNull: false,
		},
		sku: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		store_product_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'Product',
		tableName: 'products',
		timestamps: true,
		paranoid: true,
	},
);

export default ProductModel;
