// import express, {Router, Request, Response} from "express";
// import {BigBossService} from "../services";
// import {checkUserConnected} from "../middlewares";
//
//
// export class BigBossController {
//
//     buildRoutes(): Router {
//         const router = express.Router();
//         //router.use();
//         router.use(checkUserConnected());
//
//         router.post('/bigBoss', express.json(), this.createBigBoss.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
//         router.get('/bigBoss', this.getAllBigBosss.bind(this));
//         router.get('/bigBoss/:bigBoss_id', this.getBigBoss.bind(this));
//         // router.delete('/:bigBoss_id', this.deleteBigBoss.bind(this));
//         // router.put('/:bigBoss_id', express.json(), this.updateBigBoss.bind(this));
//         return router;
//     }
// }
