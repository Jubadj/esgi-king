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
        const order = await model.save();
        return order;
    }

    async getAll(): Promise<OrderDocument[]> {
        return OrderModel.find().exec();
    }

    async getById(orderId: string): Promise<OrderDocument | null> {
        return OrderModel.findById(orderId).exec();
    }

    async deleteById(orderId: string): Promise<boolean> {
        const res = await OrderModel.deleteOne({_id: orderId}).exec();
        return res.deletedCount === 1;
    }

    async updateById(orderId: string, props: OrderProps): Promise<OrderDocument | null> {
        const order = await this.getById(orderId);
        if(!order) {
            return null;
        }
        if(props.restaurant !== undefined) {
            order.restaurant = props.restaurant;
        }
        if(props.customer !== undefined) {
            order.customer = props.customer;
        }
        if(props.date !== undefined) {
            order.date = props.date;
        }
        if(props.productList !== undefined) {
            order.productList = props.productList;
        }
        if(props.price !== undefined) {
            order.price = props.price;
        }
        const res = await order.save();
        return res;
    }
}
