import {Request, RequestHandler} from "express";
import {AuthService} from "../services";
import {UserProps} from "../models";

declare module 'express' {
    export interface Request {
        user?: UserProps;
    }
}

export const ROLE = {
    BIGBOSS: 'BIGBOSS',
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
    PREPARER: 'PREPARER',
    DELIVERYMAN: 'DELIVERYMAN'
}

export function checkUserConnected(): RequestHandler {
    return async function(req: Request,
                    res,
                    next) {
        const authorization = req.headers['authorization'];
        if(authorization === undefined) {
            res.status(401).end();
            return;
        }
        const parts = authorization.split(" ");
        if(parts.length !== 2) {
            res.status(401).end();
            return;
        }
        if(parts[0] !== 'Bearer') {
            res.status(401).end();
            return;
        }
        const token = parts[1];
        try {
            const user = await AuthService.getInstance().getUserFrom(token);
            if(user === null) {
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

export function isBigBoss(): RequestHandler {
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
            if(user === null || user.role !== ROLE.BIGBOSS) {
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

export function isAdmin(): RequestHandler {
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
            if(user === null || user.role !== ROLE.ADMIN) {
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

export function isCustomer(): RequestHandler {
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
            if(user === null || user.role !== ROLE.CUSTOMER) {
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

export function isPreparer(): RequestHandler {
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
            if(user === null || user.role !== ROLE.PREPARER) {
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

export function isDeliveryMan(): RequestHandler {
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
            if(user === null || user.role !== ROLE.DELIVERYMAN) {
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
            if(user === null || user.role !== ROLE.ADMIN|| user.role !== ROLE.CUSTOMER) {
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

export function canAdminPreparer(): RequestHandler {
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
            if(user === null || user.role !== ROLE.ADMIN|| user.role !== ROLE.PREPARER) {
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
            if(user === null || user.role !== ROLE.ADMIN|| user.role !== ROLE.PREPARER) {
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