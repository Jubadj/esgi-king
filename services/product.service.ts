import {ProductDocument, ProductModel, ProductProps} from "../models";
export class ProductService {
    private static instance?: ProductService;
    public static getInstance(): ProductService {
        if(ProductService.instance === undefined) {
            ProductService.instance = new ProductService();
        }
        return ProductService.instance;
    }
    private constructor() { }

    public async createProduct(props: ProductProps): Promise<ProductDocument> {
        const model = new ProductModel(props);
        const product = await model.save();
        return product;
    }

    async getAll(): Promise<ProductDocument[]> {
        return ProductModel.find().exec();
    }

    async getById(productId: string): Promise<ProductDocument | null> {
        return ProductModel.findById(productId).exec();
    }

    async getByName(info: Pick<ProductProps, 'name'>): Promise<ProductDocument | null> {
        return  ProductModel.findOne(info).exec();
    }

    async deleteById(productId: string): Promise<boolean> {
        const res = await ProductModel.deleteOne({_id: productId}).exec();
        return res.deletedCount === 1;
    }

    async updateById(productId: string, props: ProductProps): Promise<ProductDocument | null> {
        const product = await this.getById(productId);
        if(!product) {
            return null;
        }
        if(props.name !== undefined) {
            product.name = props.name;
        }
        if(props.weight !== undefined) {
            product.weight = props.weight;
        }
        if(props.calories !== undefined) {
            product.calories = props.calories;
        }
        if(props.count !== undefined) {
            product.count = props.count;
        }
        if(props.type !== undefined) {
            product.type = props.type;
        }
        const res = await product.save();
        return res;
    }
}
