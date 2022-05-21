import {
    ProductDocument, ProductModel,
    ProductProps,
    SessionModel,
    SetMenuDocument,
    SetMenuModel,
    SetMenuProps,
    UserModel
} from "../models";
import {SecurityUtils} from "../utils";
import {ProductService} from "./product.service";
export class SetMenuService {
    private static instance?: SetMenuService;
    public static getInstance(): SetMenuService {
        if(SetMenuService.instance === undefined) {
            SetMenuService.instance = new SetMenuService();
        }
        return SetMenuService.instance;
    }
    private constructor() { }

    public async createSetMenu(props: SetMenuProps): Promise<SetMenuDocument> {
        const model = new SetMenuModel(props);
        const setMenu = await model.save();
        return setMenu;
    }

    async getAll(): Promise<SetMenuDocument[]> {
        return SetMenuModel.find().exec();
    }

    async getById(setMenuId: string): Promise<SetMenuDocument | null> {
        return SetMenuModel.findById(setMenuId).exec();
    }

    async getByName(name: string): Promise<SetMenuDocument | null> {
        return  SetMenuModel.findOne({"name": name}).exec();
    }

    async deleteById(setMenuId: string): Promise<boolean> {
        const res = await SetMenuModel.deleteOne({_id: setMenuId}).exec();
        return res.deletedCount === 1;
    }

    async updateById(setMenuId: string, props: SetMenuProps): Promise<SetMenuDocument | null> {
        const setMenu = await this.getById(setMenuId);
        if(!setMenu) {
            return null;
        }
        if(props.name !== undefined) {
            setMenu.name = props.name;
        }
        if(props.product !== undefined) {
            setMenu.product = props.product;
        }
        if(props.price !== undefined) {
            setMenu.price = props.price;
        }
        return await setMenu.save();
    }

    async exist(menuName: string): Promise<boolean> {
        const menu = await this.getByName(menuName);
        if (!menu) {
            return false;
        }
        return true;
    }

    async getProducts(menu: SetMenuDocument): Promise<ProductDocument[]>{
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

    // async addProductToMenu(menu_id: String){
    //     const menu = await SetMenuModel.findOne({
    //         login: info.login,
    //         password: SecurityUtils.sha512(info.password)
    //     }).exec();
    //     if(menu === null) {
    //         throw new Error('Menu not found');
    //     }
    //     // 604_800 -> 1 week in seconds
    //     const currentDate = new Date();
    //     const expirationDate = new Date(currentDate.getTime() + 604_800_000);
    //     const session = await SessionModel.create({
    //         platform,
    //         expiration: expirationDate,
    //         user: user._id
    //     });
    //     user.sessions.push(session._id); // permet de memoriser la session dans le user
    //     await user.save();
    // }

}
