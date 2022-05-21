import {AdminDocument, AdminModel, AdminProps, RestaurantDocument, RestaurantModel} from "../models";
import {RestaurantService} from "./restaurant.service";


export class AdminService {

    private static instance?: AdminService;

    public static getInstance(): AdminService {
        if(AdminService.instance === undefined) {
            AdminService.instance = new AdminService();
        }
        return AdminService.instance;
    }

    private constructor() { }

    public async createAdmin(props: AdminProps): Promise<AdminDocument> {
        const model = new AdminModel(props);
        const admin = await model.save();
        return admin;
    }

    async getAll(): Promise<AdminDocument[]> {
        return AdminModel.find().exec();
    }

    async getById(adminId: string): Promise<AdminDocument | null> {
        return AdminModel.findById(adminId).exec();
    }

    async deleteById(adminId: string): Promise<boolean> {
        const res = await AdminModel.deleteOne({_id: adminId}).exec();
        return res.deletedCount === 1;
    }

    async updateById(adminId: string, props: AdminProps): Promise<AdminDocument | null> {
        const admin = await this.getById(adminId);
        if(!admin) {
            return null;
        }
        if(props.username !== undefined) {
            admin.username = props.username;
        }
        if(props.restaurant !== undefined) {
            admin.restaurant = props.restaurant;
        }
        const res = await admin.save();
        return res;
    }
}