import {Request, RequestHandler} from "express";
import {AuthService} from "../services";
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
            if(user === null || user.role !== ROLE.ADMIN|| user.role !== ROLE.CUSTOMER || user.role! == ROLE.PREPARER) {
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