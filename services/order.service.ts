import {OrderDocument, OrderModel, OrderProps} from "../models";
import {Mode, StatusPreparation} from "../utils/order.enum";
import {DiscountService, MenuService, ProductService} from "../services";


export class OrderService {
    private static instance?: OrderService;

    public static getInstance(): OrderService {
        if (OrderService.instance === undefined) {
            OrderService.instance = new OrderService();
        }
        return OrderService.instance;
    }

    private constructor() {
    }

    public async createOrder(props: OrderProps): Promise<OrderDocument> {
        const model = new OrderModel(props);
        return await model.save();
    }

    async getAll(): Promise<OrderDocument[]> {
        return OrderModel.find().exec();
    }

    async getAllOwn(customer_id: String): Promise<OrderDocument[]> {
        return OrderModel.find({"customer": customer_id}).exec();
    }

    async getById(orderId: string): Promise<OrderDocument | null> {
        return OrderModel.findById(orderId).exec();
    }

    async deleteById(orderId: string): Promise<boolean> {
        const res = await OrderModel.deleteOne({_id: orderId}).exec();
        return res.deletedCount === 1;
    }

    /*
    * Calculate the price of an order with its contains products
    * */
    async calculatePrice(productList: null | string[], menuList: null | string[]) {
        let result = 0;
        if (productList !== null && productList !== []){
            for (let i = 0; i < productList?.length; i++) {
                const product = await ProductService.getInstance().getByName(productList[i]);
                if (product){
                    result += product.price;
                }
            }
        }

        if (menuList && menuList !== []){
            for (let i = 0; i < menuList?.length; i++) {
                const menu = await MenuService.getInstance().getByName(menuList[i]);
                if (menu){
                    result += menu.price;
                }
            }
        }
        return result;
    }

    async updateById(orderId: string, props: OrderProps): Promise<OrderDocument | null> {
        const order = await this.getById(orderId);
        if (!order) {
            return null;
        }
        if (props.restaurant !== undefined) {
            order.restaurant = props.restaurant;
        }
        if (props.customerName !== undefined) {
            order.customerName = props.customerName;
        }
        if (props.productList !== undefined) {
            order.productList = props.productList;
        }
        if (props.menuList !== undefined) {
            order.menuList = props.menuList;
        }
        if (props.price !== undefined) {
            order.price = props.price;
        }
        if (props.mode !== undefined) {
            order.mode = props.mode;
        }
        if (props.statusPreparation !== undefined) {
            order.statusPreparation = props.statusPreparation;
        }
        if (props.paid !== undefined) {
            order.paid = props.paid;
        }
        if (props.deliveryMan !== undefined) {
            order.deliveryMan = props.deliveryMan;
        }
        if (props.preparer !== undefined) {
            order.preparer = props.preparer;
        }
        return await order.save();
    }

    /*
    * Change the status of an order
    * */
    async updateStatus(orderId: string, status: string): Promise<OrderDocument | null> {
        const order = await this.getById(orderId);
        if (!order) {
            console.log("updateStatus Error: service problem order");
            return null;
        }
        if (status !== undefined) {
            if (status !== StatusPreparation.TODO && status !== StatusPreparation.DONE && status !== StatusPreparation.TODELIVER) {
                console.log("updateStatus Error: wrong parameter");
                return null;
            }
            order.statusPreparation = status;
            return await order.save();
        }
        return null;
    }
//TODO Comment
    async pay(orderId: string, initialPrice: number, discount : string | undefined): Promise<OrderDocument | null> {

        const order = await this.getById(orderId);
        if (!order) {
            console.log("pay error: order do not exist.");
            return null;
        }

        if(discount) {
            const promo = await DiscountService.getInstance().getByCode(discount);

            if (!promo) {
                console.log("pay error: discount code not found");
                return null;
            }
            const orderPrice = order.price - (order.price * (promo.percent / 100));
            // }else{//TODO what is it for ?
            //     const orderPrice = order.price;
            // }
        }

        const orderPrice = initialPrice;

        if(order.paid){
            console.log("pay error: order already paid");
            return null;
        }

        if (!initialPrice) {
            console.log("pay error: order already paid");
            return null;
        }

        if (initialPrice < orderPrice) {
                console.log("pay Error: Insufficient amount");
                return null;
            }
            order.paid = true;
            return await order.save();
        //TODO Comment
        return null;
    }

    /*
    * Change the status of an order
    *   to "TODELIVER" status for online orders
    *   or "DONE" status for offline orders
    *   if the order is "TODO" status
    * */
    async prepare(orderId: string):  Promise<OrderDocument | null>{
        const order = await OrderService.getInstance().getById(orderId);

        if (!order){
            return null;
        }

        if (order.mode == Mode.ONSITE){
            order.statusPreparation = StatusPreparation.DONE;
        }
        else if (order.mode == Mode.INDELIVERY){
            order.statusPreparation = StatusPreparation.TODELIVER;
        }
        return await order.save();
    }

    /*
    * Change the status of an order
    *   to "DONE" status
    *   if the order is "TODELIVER" status
    * */
    async deliver(orderId: string):  Promise<OrderDocument | null>{
        const order = await OrderService.getInstance().getById(orderId);

        if (!order){
            return null;
        }
        if (order.statusPreparation != StatusPreparation.TODELIVER){
            console.log("deliver service Error: Order not prepared.")
            return null;
        }

        order.statusPreparation = StatusPreparation.DONE;
        return await order.save();
    }
}
