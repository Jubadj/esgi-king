import {DiscountDocument, DiscountModel, DiscountProps} from "../models";
export class DiscountService {
    private static instance?: DiscountService;
    public static getInstance(): DiscountService {
        if(DiscountService.instance === undefined) {
            DiscountService.instance = new DiscountService();
        }
        return DiscountService.instance;
    }
    private constructor() { }

    public async createDiscount(props: DiscountProps): Promise<DiscountDocument> {
        const model = new DiscountModel(props);
        const discount = await model.save();
        return discount;
    }

    async getAll(): Promise<DiscountDocument[]> {
        return DiscountModel.find().exec();
    }

    async getById(discountId: string): Promise<DiscountDocument | null> {
        return DiscountModel.findById(discountId).exec();
    }

    async getByCode(info: Pick<DiscountProps, 'code'>): Promise<DiscountDocument | null> {
        return  DiscountModel.findOne(info).exec();
    }

    async deleteById(discountId: string): Promise<boolean> {
        const res = await DiscountModel.deleteOne({_id: discountId}).exec();
        return res.deletedCount === 1;
    }

    async updateById(discountId: string, props: DiscountProps): Promise<DiscountDocument | null> {
        const discount = await this.getById(discountId);
        if(!discount) {
            return null;
        }
        if(props.code !== undefined) {
            discount.code = props.code;
        }
        if(props.expirationDate !== undefined) {
            discount.expirationDate = props.expirationDate;
        }
        if(props.percent !== undefined) {
            discount.percent = props.percent;
        }
        const res = await discount.save();
        return res;
    }
}
