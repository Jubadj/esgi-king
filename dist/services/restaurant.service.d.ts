import { RestaurantDocument, RestaurantProps } from "../models";
export declare class RestaurantService {
    private static instance?;
    static getInstance(): RestaurantService;
    private constructor();
    createRestaurant(props: RestaurantProps): Promise<RestaurantDocument>;
    getAll(): Promise<RestaurantDocument[]>;
    getById(restaurantId: string): Promise<RestaurantDocument | null>;
    deleteById(restaurantId: string): Promise<boolean>;
    updateById(restaurantId: string, props: RestaurantProps): Promise<RestaurantDocument | null>;
}
