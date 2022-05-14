import { AdminDocument, RestaurantDocument } from "../models";
export declare class BigBossService {
    private static instance?;
    static getInstance(): BigBossService;
    private constructor();
    affectAdmin(adminId: string, restaurantId: string): Promise<[AdminDocument, RestaurantDocument] | null>;
}
