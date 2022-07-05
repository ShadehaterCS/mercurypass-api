//ENDPOINT api/messages
import Router from "koa-router";
import { Message } from "../entities/Message";
import { DI } from "../server";

import { verifyAdminToken } from "./adminController";
const router = new Router()

router.post('/new', async (ctx) => {
    try {
        const userMessage = ctx.headers.message;
        const userEmail = ctx.headers.email;

        if (userMessage && userEmail) {
            //@ts-ignore
            const newMessage = new Message(userEmail, userMessage)
            DI.em.persistAndFlush(newMessage)
        }

        ctx.body = 'Message submitted successfully'
    } catch (error) {
        ctx
    }
})

router.get('/', async (ctx) => {
    try {
        //@ts-ignore
        const uid = await verifyAdminToken(ctx.headers.token)
        if (uid !== process.env.ADMINTOKEN) {
            ctx.throw(401)
        }

        const messages = await DI.messageRepository.findAll()
        if (messages) {
            ctx.body = messages;
        }
    } catch (error) {

    }
})
export const MessagesController = router