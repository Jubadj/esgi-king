import express, {Request, Response, Router} from "express";
import {AdminService, AuthService} from "../services";
import {checkUserConnected, ROLE} from "../middlewares";
import {AdminController} from "./admin.controller";



export class AuthController {

    async createUser(req: Request, res: Response) {
        if(req.body.role != ROLE.BIGBOSS && req.body.role != ROLE.ADMIN &&  req.body.role != ROLE.CUSTOMER &&  req.body.role != ROLE.PREPARER &&  req.body.role != ROLE.DELIVERYMAN){
            res.status(400).end();
        }

        try {
            const user = await AuthService.getInstance().subscribeUser({
                login: req.body.login,
                password: req.body.password,
                role: req.body.role,
                firstName: req.body.firstName,
                lastName: req.body.lastName
            });
            if(req.body.role === ROLE.ADMIN){
                const user = await AdminService.getInstance().createAdmin({
                    username: req.body.login
                });
            }
            res.json(user);
        } catch(err) {
            res.status(400).end();
        }
    }

    async logUser(req: Request, res: Response) {
        const platform = req.headers['user-agent'] || "Unknown";
        try {
            const session = await AuthService.getInstance().logIn({
                login: req.body.login,
                password: req.body.password
            }, platform);
            res.json({
                token: session?._id
            });
        } catch(err) {
            res.status(401).end(); // unauthorized
        }
    }

    async me(req: Request, res: Response) {
        res.json(req.user);
    }


    buildRoutes(): Router {
        const router = express.Router();
        router.post('/subscribe', express.json(), this.createUser.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.post('/login', express.json(), this.logUser.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/me', checkUserConnected(), this.me.bind(this));
        return router;
    }
}
