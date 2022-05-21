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
            if(user === null || (user.role !== ROLE.ADMIN && user.role !== ROLE.CUSTOMER && user.role!== ROLE.PREPARER)) {
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
                res.status(401).json("Order or user problem");
                return;
            }
            if (user.role === ROLE.CUSTOMER){
                if (!order.customer?._id.equals(user._id)){
                    res.status(401).json("This is not your order ;) : Incorrect customer id");
                    return;
                }
            }
            next();
        } catch(err) {
            res.status(401).end();
        }
    }
}

// can change order's status (exclusively !)
export function canChangeOrderStatus(): RequestHandler {
    return async function (req: Request,
                           res,
                           next) {
        const authorization = req.headers['authorization'];
        if (authorization === undefined) {
            res.status(401).end();
            return;
        }
        const parts = authorization.split(" ");
        const token = parts[1];
        try {
            const user = await AuthService.getInstance().getUserFrom(token);
            const order = await OrderService.getInstance().getById(req.params.order_id);
            if (user === null || order === null) {
                res.status(401).json("Order or user problem");
                return;
            }
            if (user.role !== ROLE.PREPARER) {
                res.status(401).json("user is not allowed to change order's status !");
                return;
            }
            next();
        } catch (err) {
            res.status(401).end();
        }

    }
}