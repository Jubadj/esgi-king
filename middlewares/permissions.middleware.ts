import {Request, RequestHandler} from "express";
import {AuthService, OrderService} from "../services";
import {UserProps} from "../models";
import {ROLE} from "./auth.middleware";

declare module 'express' {
    export interface Request {
        user?: UserProps;
    }
}

export function canSeeProduct(): RequestHandler {
    return async function(req: Request,
                          res,
                          next){
        const authorization = req.headers['authorization'];
        if(authorization === undefined) {
            res.status(401).end();
            return;
        }
        const parts = authorization.split(" ");
        const token = parts[1];
        try {
            const user = await AuthService.getInstance().getUserFrom(token);
            if(user === null || user.role !== ROLE.ADMIN|| user.role !== ROLE.CUSTOMER || user.role!== ROLE.PREPARER) {
                res.status(401).end();
                return;
            }
            req.user = user;
            next();
        } catch(err) {
            res.status(401).end();
        }
    }
}

// If is customer, verify his id with the id in the order
export function canSeeOrder(): RequestHandler {
    return async function(req: Request,
                          res,
                          next){
        const authorization = req.headers['authorization'];
        if(authorization === undefined) {
            res.status(401).end();
            return;
        }
        const parts = authorization.split(" ");
        const token = parts[1];
        try {
            const user = await AuthService.getInstance().getUserFrom(token);
            const order = await OrderService.getInstance().getById(req.params.order_id);
            if (user === null || order===null){
                console.log("order or user problem");
                res.status(401).end();
                return;
            }
            if (user.role === ROLE.CUSTOMER){
                console.log("we are customer");
                console.log(user._id);
                console.log(order.customer);

                if ( user._id != order.customer?._id){
                    console.log("we are customer: incorrect id");
                    res.status(401).end();
                    return;
                }
            }
            // if(user.role !== ROLE.ADMIN || user.role!== ROLE.BIGBOSS) {
            //     res.status(401).end();
            //     return;
            // }
            next();
        } catch(err) {
            res.status(401).end();
        }
    }
}