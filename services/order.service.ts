import {DiscountProps, OrderDocument, OrderModel, OrderProps} from "../models";
import {Mode, StatusPreparation} from "../utils/order.enum";
import {discountEnum} from "../utils/discount.enum";
import {DiscountService, ProductService, SetMenuService} from "../services";


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


    async calculatePrice(productList: null | string[], menuList: null | string[]) {
        let result = 0;
        if (productList !== null && productList !== []){
            for (let i = 0; i < productList?.length; i++) {
                const product = await ProductService.getInstance().getByName(productList[i]);
                if (product){
                    console.log("on rentre dans la productList");
                    result += product.price;
                }
            }
        }

        if (menuList && menuList !== []){
            for (let i = 0; i < menuList?.length; i++) {
                const menu = await SetMenuService.getInstance().getByName(menuList[i]);
                if (menu){
                    result += menu.price;
                }
            }
        }
        console.log("on retourne ici");
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
            // }else{
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

        return null;
    }

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
        const res = await order.save();
        return res;
    }

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
