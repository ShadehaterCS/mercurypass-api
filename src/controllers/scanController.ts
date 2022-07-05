//ENDPOINT api/scan
import Router from "koa-router";
import { UserTrip } from "../entities/UserTrip";

const router = new Router()
// const admin = require('firebase-admin');

import { DI } from '../server'
import { isActive } from '../actions/date-actions'

// import { verifyAdminToken } from './adminController'

/*
Scanning a pass has 2 stages
    1: Verify that the ticket is active, means that the expiration date is in the future 
        if it is a semester pass then check if today falls inside the appropriate window
    2: Create a trip for that pass and dispatch it to the database. 

*/
router.post('/:passId', async (ctx) => {
    try {
        // // @ts-ignore
        // const uid = await verifyAdminToken(ctx.headers.userToken)

        // if (!uid) {
        //     ctx.throw(401)
        // }

        const pass = await DI.passRepository.findOneOrFail({ passId: ctx.params.passId }, { populate: true })
        if (!pass) {
            ctx.throw(404)
            return
        }
        //Simple implementation, don't care about specific cities
        if (isActive(pass!!.expirationDate, pass!!.type)) {
            const newTrip = new UserTrip('Vienna', pass!!, 'Metro')
            pass!!.trips.add(newTrip)

            DI.em.persistAndFlush(pass!!);
            ctx.body = 'Pass scanned successfully'
        }
        else {
            ctx.throw(404)
            return
        }

    } catch (error) {
        ctx.throw(501, error)
    }
})


export const ScanController = router;
