import { RequestHandler } from "express";
import { UserProps } from "../models";
declare module 'express' {
    interface Request {
        user?: UserProps;
    }
}
export declare const ROLE: {
    BIGBOSS: string;
    ADMIN: string;
    CUSTOMER: string;
    PREPARER: string;
    DELIVERYMAN: string;
};
export declare function checkUserConnected(): RequestHandler;
export declare function isBigBoss(): RequestHandler;
export declare function isAdmin(): RequestHandler;
export declare function isCustomer(): RequestHandler;
export declare function isPreparer(): RequestHandler;
export declare function isDeliveryMan(): RequestHandler;
