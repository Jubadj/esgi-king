import {DiscountProps, OrderDocument, OrderModel, OrderProps} from "../models";
import {StatusPreparation} from "../utils/order.enum";
import {discountEnum, promo} from "../utils/discount.enum";
import {DiscountService} from "../services";


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

    // TODO
    async calculatePrice(productList: null | String[], menuList: null | String[]) {
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
        return await order.save();
    }

    async updateStatus(orderId: string, status: string): Promise<OrderDocument | null> {
        const order = await this.getById(orderId);
        if (!order) {
            console.log("service problem order");
            return null;
        }
        if (status !== undefined) {
            if (status !== StatusPreparation.TODO && status !== StatusPreparation.INPROGRESS && status !== StatusPreparation.DONE) {
                console.log("updateStatus Error: wrong parameter");
                return null;
            }
            order.statusPreparation = status;
            return await order.save();
        }
        return null;
    }

    async convert(code: string) : Promise<number | null> {
        if(code !== undefined){
            if (code !== "EURO5" && code !== "EURO10" && code !== "EURO15") {
                return null;
            }
            if(discountEnum[code] === undefined){
                return null;
            }
            return discountEnum[code].price;
        }
        return null;
    }

    async pay(orderId: string, initialPrice: number, discount : string): Promise<OrderDocument | null> {
        if(!discount){
            const reduce = 0;
        }

        const promo = await DiscountService.getInstance().getByCode(discount);

        if(!promo){
            console.log("discount code not found");
            return null;
        }

        const order = await this.getById(orderId);

        if (!order) {
            console.log("service problem order");
            return null;
        }

        const orderPrice = order.price - (order.price * (promo.percent / 100));

        if(order.paid === true){
            console.log("order already paid");
            return null;
        }

        if (initialPrice !== undefined) {
            if (initialPrice < orderPrice) {
                console.log("pay Error: Insufficient amount");
                return null;
            }
            order.paid = true;
            return await order.save();
        }
        return null;
    }
}
