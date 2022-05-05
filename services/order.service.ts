import {OrderDocument, OrderModel, OrderProps} from "../models";
export class OrderService {
    private static instance?: OrderService;
    public static getInstance(): OrderService {
        if(OrderService.instance === undefined) {
            OrderService.instance = new OrderService();
        }
        return OrderService.instance;
    }
    private constructor() { }

    public async createOrder(props: OrderProps): Promise<OrderDocument> {
        const model = new OrderModel(props);
        return await model.save();
    }

    async getAll(): Promise<OrderDocument[]> {
        return OrderModel.find().exec();
    }

    async getAllOwn(restaurantId: String, customerName: String, date: Date): Promise<OrderDocument[]> {
        return OrderModel.find({"restaurant": restaurantId, "customerName": customerName,
            "createdAt": Date}).exec();
    }

    async getById(orderId: string): Promise<OrderDocument | null> {
        return OrderModel.findById(orderId).exec();
    }

    async deleteById(orderId: string): Promise<boolean> {
        const res = await OrderModel.deleteOne({_id: orderId}).exec();
        return res.deletedCount === 1;
    }

    // TODO
    async calculatePrice(productList: null | String[], menuList: null | String[]){
        // for (let i = 0; i < productList.lenght; i++) {
        //     console.log ("Block statement execution no." + i);
        // }
        // for (let i = 0; i < menuList.lenght; i++) {
        //     console.log ("Block statement execution no." + i);
        // }
        return 5;
    }

    async updateById(orderId: string, props: OrderProps): Promise<OrderDocument | null> {
        const order = await this.getById(orderId);
        if(!order) {
            return null;
        }
        if(props.restaurant !== undefined) {
            order.restaurant = props.restaurant;
        }
        if(props.customerName !== undefined) {
            order.customerName = props.customerName;
        }
        if(props.productList !== undefined) {
            order.productList = props.productList;
        }
        if(props.menuList !== undefined) {
            order.menuList = props.menuList;
        }
        if(props.price !== undefined) {
            order.price = props.price;
        }
        if(props.mode !== undefined) {
            order.mode = props.mode;
        }
        if(props.statusPreparation !== undefined) {
            order.statusPreparation = props.statusPreparation;
        }
        return await order.save();
    }
}
