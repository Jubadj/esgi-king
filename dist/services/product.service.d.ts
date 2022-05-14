import { ProductDocument, ProductProps } from "../models";
export declare class ProductService {
    private static instance?;
    static getInstance(): ProductService;
    private constructor();
    createProduct(props: ProductProps): Promise<ProductDocument>;
    getAll(): Promise<ProductDocument[]>;
    getById(productId: string): Promise<ProductDocument | null>;
    getByName(info: Pick<ProductProps, 'name'>): Promise<ProductDocument | null>;
    deleteById(productId: string): Promise<boolean>;
    updateById(productId: string, props: ProductProps): Promise<ProductDocument | null>;
}
