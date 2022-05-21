import {RestaurantDocument, RestaurantModel, RestaurantProps} from "../models";

export class RestaurantService {
    private static instance?: RestaurantService;
    public static getInstance(): RestaurantService {
        if(RestaurantService.instance === undefined) {
            RestaurantService.instance = new RestaurantService();
        }
        return RestaurantService.instance;
    }
    private constructor() { }

    public async createRestaurant(props: RestaurantProps): Promise<RestaurantDocument> {
        const model = new RestaurantModel(props);
        const restaurant = await model.save();
        return restaurant;
    }

    async getAll(): Promise<RestaurantDocument[]> {
        return RestaurantModel.find().exec();
    }

    async getById(restaurantId: string): Promise<RestaurantDocument | null> {
        return RestaurantModel.findById(restaurantId).exec();
    }

    async deleteById(restaurantId: string): Promise<boolean> {
        const res = await RestaurantModel.deleteOne({_id: restaurantId}).exec();
        return res.deletedCount === 1;
    }

    async updateById(restaurantId: string, props: RestaurantProps): Promise<RestaurantDocument | null> {
        const restaurant = await this.getById(restaurantId);
        if(!restaurant) {
            return null;
        }
        if(props.name !== undefined) {
            restaurant.name = props.name;
        }
        if(props.address !== undefined) {
            restaurant.address = props.address;
        }
        if(props.city !== undefined) {
            restaurant.city = props.city;
        }
        if(props.postalCode !== undefined) {
            restaurant.postalCode = props.postalCode;
        }
        if(props.country !== undefined) {
            restaurant.country = props.country;
        }
        return await restaurant.save();
    }
}
