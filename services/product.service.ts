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
        return await model.save();
    }

    async getAll(): Promise<ProductDocument[]> {
        return ProductModel.find().exec();
    }

    async getById(productId: string): Promise<ProductDocument | null> {
        return ProductModel.findById(productId).exec();
    }

    async getByName(name: string): Promise<ProductDocument | null> {
        return  ProductModel.findOne({"name": name}).exec();
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
        // if(props.count !== undefined) {
        //     product.count = props.count;
        // }
        if(props.price !== undefined) {
            product.price = props.price;
        }
        const res = await product.save();
        return res;
    }

    /*
    * Verify if a production exists in DB
    * */
    async exist(productName:string): Promise<boolean> {
        const tmpProduct = await this.getByName(productName);
        if ( !tmpProduct ){
            return false;
        }
        return true;
    }

    // /*
    // * Verify if a product is in stock in DB
    // * */
    // async productAvailable(productName:string): Promise<boolean>{
    //     const tmpProduct = await this.getByName(productName);
    //     if ( !tmpProduct ){
    //         return false;
    //     }
    //     else if  (tmpProduct.count<=0){
    //         return false;
    //     }
    //     return true;
    // }

    /*
    * Decrement the number of a product in the DB
    * */
    async countDecrease(productName: string): Promise<boolean>{
        const product = await this.getByName(productName);
        if ( product ){
            await product.save();
            return true;
        }
        return false;
    }
}
