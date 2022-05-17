import express, {Request, Response, Router} from "express";
import {io} from "../models";
import * as buffer from "buffer";

export class MessageController{
    async sendMessage(req: Request, res: Response){
        const msgBody = req.body;
        if (!msgBody.content){
            res.status(400).end().json("wrong msgBody ! Please edit a content"); // 400 -> bad request
            return;
        }
        io.on("connection", (socket) => {
            socket.emit("noArg");
            socket.emit("basicEmit", 1, msgBody.content, Buffer.from([3]));
            socket.emit("withAck", "4", (e) => {
                // e is inferred as number
            });
        });
        res.json(msgBody.content);
    }

    async  getMessage(req: Request, res:Response){
        io.on("connection", (socket) => {
            socket.on("hello", () => {
                console.log("message received !");
                io.emit("basicEmit", 1, "hello", buffer[0]);
            });
        });
        res.json();
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.post('/send', express.json(), this.sendMessage.bind(this));
        router.get('/receive', this.getMessage.bind(this));

        return router;
    }

}