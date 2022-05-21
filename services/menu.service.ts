import {
    ProductDocument,
    MenuDocument,
    MenuModel,
    MenuProps,
} from "../models";

import {ProductService} from "./product.service";

export class MenuService {
    private static instance?: MenuService;
    public static getInstance(): MenuService {
        if(MenuService.instance === undefined) {
            MenuService.instance = new MenuService();
        }
        return MenuService.instance;
    }
    private constructor() { }

    public async createMenu(props: MenuProps): Promise<MenuDocument> {
        const model = new MenuModel(props);
        const menu = await model.save();
        return menu;
    }

    async getAll(): Promise<MenuDocument[]> {
        return MenuModel.find().exec();
    }

    async getById(menuId: string): Promise<MenuDocument | null> {
        return MenuModel.findById(menuId).exec();
    }

    async getByName(name: string): Promise<MenuDocument | null> {
        return  MenuModel.findOne({"name": name}).exec();
    }

    async deleteById(menuId: string): Promise<boolean> {
        const res = await MenuModel.deleteOne({_id: menuId}).exec();
        return res.deletedCount === 1;
    }

    async updateById(menuId: string, props: MenuProps): Promise<MenuDocument | null> {
        const menu = await this.getById(menuId);
        if(!menu) {
            return null;
        }
        if(props.name !== undefined) {
            menu.name = props.name;
        }
        if(props.product !== undefined) {
            if(props.product){
                const products = props.product;
                for (let i=0; i<products.length; i++){
                    const product = await ProductService.getInstance().getByName(products[i]);
                    if(!product){
                        console.log("createMenu error: Product not found in DB"); // 400 -> bad request
                        return null;
                    }
                }
            }
            menu.product = props.product;
        }
        if(props.price !== undefined) {
            menu.price = props.price;
        }
        return await menu.save();
    }

    async exist(menuName: string): Promise<boolean> {
        const menu = await this.getByName(menuName);
        if (!menu) {
            return false;
        }
        return true;
    }

    async getProducts(menu: MenuDocument): Promise<ProductDocument[]>{
        let productsList = [];
        if (menu.product){
            for (let i=0; i<menu.product.length; i++){
                let product = await ProductService.getInstance().getById(menu.product[i]);
                if (product){
                    productsList.push(product);
                }
            }
        }
        return productsList;
    }

    async menuAvailable(menuName: string): Promise<boolean>{
        const menu = await this.getByName(menuName);
        if ( !menu ){
            return false;
        }
        for (let i=0; menu.product?.length; i++){
            const tmpProduct = await ProductService.getInstance().getByName(menu.product[i]);
            if  (!tmpProduct){
                return false;
            }
            if ( !await ProductService.getInstance().productAvailable(tmpProduct.name)){
                return false;
            }
        }
        return true;
    }

}
