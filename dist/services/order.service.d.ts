import { OrderDocument, OrderProps } from "../models";
export declare class OrderService {
    private static instance?;
    static getInstance(): OrderService;
    private constructor();
    createOrder(props: OrderProps): Promise<OrderDocument>;
    getAll(): Promise<OrderDocument[]>;
    getAllOwn(customer_id: String): Promise<OrderDocument[]>;
    getById(orderId: string): Promise<OrderDocument | null>;
    deleteById(orderId: string): Promise<boolean>;
    calculatePrice(productList: null | String[], menuList: null | String[]): Promise<number>;
    updateById(orderId: string, props: OrderProps): Promise<OrderDocument | null>;
}
