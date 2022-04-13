import {SetMenuDocument, SetMenuModel, SetMenuProps} from "../models";
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
        const res = await setMenu.save();
        return res;
    }
}
