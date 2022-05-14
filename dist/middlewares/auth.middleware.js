"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDeliveryMan = exports.isPreparer = exports.isCustomer = exports.isAdmin = exports.isBigBoss = exports.checkUserConnected = exports.ROLE = void 0;
const services_1 = require("../services");
exports.ROLE = {
    BIGBOSS: 'BIGBOSS',
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
    PREPARER: 'PREPARER',
    DELIVERYMAN: 'DELIVERYMAN'
};
function checkUserConnected() {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorization = req.headers['authorization'];
            if (authorization === undefined) {
                res.status(401).end();
                return;
            }
            const parts = authorization.split(" ");
            if (parts.length !== 2) {
                res.status(401).end();
                return;
            }
            if (parts[0] !== 'Bearer') {
                res.status(401).end();
                return;
            }
            const token = parts[1];
            try {
                const user = yield services_1.AuthService.getInstance().getUserFrom(token);
                if (user === null) {
                    res.status(401).end();
                    return;
                }
                req.user = user;
                next();
            }
            catch (err) {
                res.status(401).end();
            }
        });
    };
}
exports.checkUserConnected = checkUserConnected;
function isBigBoss() {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorization = req.headers['authorization'];
            if (authorization === undefined) {
                res.status(401).end();
                return;
            }
            const parts = authorization.split(" ");
            const token = parts[1];
            try {
                const user = yield services_1.AuthService.getInstance().getUserFrom(token);
                if (user === null || user.role !== exports.ROLE.BIGBOSS) {
                    res.status(401).end();
                    return;
                }
                req.user = user;
                next();
            }
            catch (err) {
                res.status(401).end();
            }
        });
    };
}
exports.isBigBoss = isBigBoss;
function isAdmin() {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorization = req.headers['authorization'];
            if (authorization === undefined) {
                res.status(401).end();
                return;
            }
            const parts = authorization.split(" ");
            const token = parts[1];
            try {
                const user = yield services_1.AuthService.getInstance().getUserFrom(token);
                if (user === null || user.role !== exports.ROLE.ADMIN) {
                    res.status(401).end();
                    return;
                }
                req.user = user;
                next();
            }
            catch (err) {
                res.status(401).end();
            }
        });
    };
}
exports.isAdmin = isAdmin;
function isCustomer() {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorization = req.headers['authorization'];
            if (authorization === undefined) {
                res.status(401).end();
                return;
            }
            const parts = authorization.split(" ");
            const token = parts[1];
            try {
                const user = yield services_1.AuthService.getInstance().getUserFrom(token);
                if (user === null || user.role !== exports.ROLE.CUSTOMER) {
                    res.status(401).end();
                    return;
                }
                req.user = user;
                next();
            }
            catch (err) {
                res.status(401).end();
            }
        });
    };
}
exports.isCustomer = isCustomer;
function isPreparer() {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorization = req.headers['authorization'];
            if (authorization === undefined) {
                res.status(401).end();
                return;
            }
            const parts = authorization.split(" ");
            const token = parts[1];
            try {
                const user = yield services_1.AuthService.getInstance().getUserFrom(token);
                if (user === null || user.role !== exports.ROLE.PREPARER) {
                    res.status(401).end();
                    return;
                }
                req.user = user;
                next();
            }
            catch (err) {
                res.status(401).end();
            }
        });
    };
}
exports.isPreparer = isPreparer;
function isDeliveryMan() {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorization = req.headers['authorization'];
            if (authorization === undefined) {
                res.status(401).end();
                return;
            }
            const parts = authorization.split(" ");
            const token = parts[1];
            try {
                const user = yield services_1.AuthService.getInstance().getUserFrom(token);
                if (user === null || user.role !== exports.ROLE.DELIVERYMAN) {
                    res.status(401).end();
                    return;
                }
                req.user = user;
                next();
            }
            catch (err) {
                res.status(401).end();
            }
        });
    };
}
exports.isDeliveryMan = isDeliveryMan;
//# sourceMappingURL=auth.middleware.js.map