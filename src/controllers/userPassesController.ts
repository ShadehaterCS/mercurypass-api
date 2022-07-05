// ENDPOINT api/passes
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import Router from "koa-router";
import { UserPass } from "../entities/UserPass";
import { getDateBasedOnType, isActive } from '../actions/date-actions'

const router = new Router()
const admin = require('firebase-admin');

import { DI } from '../server'

import { randomUUID } from "crypto";
import { Collection, wrap } from "@mikro-orm/core";
import { UserTrip } from "../entities/UserTrip";


/*
Verifies a user's actions
@returns the user's id token as described inside the database
Since the JWTs are created on the fly by firebase, there is no need to do additional checks
inside the functions
*/
async function verifyToken(token: string) {
    return admin.auth()
        .verifyIdToken(token)
        .then((decodedToken: DecodedIdToken) => {
            const uid = decodedToken.uid;
            return uid;
        })
        .catch((error: string) => {
            console.log(error)
            return null
        });
}

//@returns all the passes
router.get('/user/', async (ctx) => {
    try {
        //@ts-ignore
        const uid = await verifyToken(ctx.headers.token)

        if (uid) {
            const passes = await DI.passRepository.find({ ownerId: uid }, { populate: true })
            ctx.body = passes
        }
        else {
            ctx.throw(401)
        }
    } catch (error) {
        ctx.throw(401)
    }
})

//Returns a specific pass based on its passId, not its primaryKey id
router.get('/:passId', async (ctx) => {
    try {
        if (ctx.headers.token) {
            const token: string = ctx.headers.token.toString();
            const uid = await verifyToken(token);
            if (!uid)
                ctx.throw(401);

            const passDetails = await DI.passRepository
                .findOne({ passId: ctx.params.passId, ownerId: uid }, { populate: true, })

            if (passDetails) {
                const activeStatus = isActive(passDetails.expirationDate, passDetails.type)
                ctx.body = {
                    passDetails,
                    activeStatus
                }
            }
            else {
                ctx.throw(404);
            }
        }
        else {
            ctx.throw(405)
        }

    }
    catch (err) {
        ctx.throw(501)
    }
})

//Creates a new pass based on the 3 headers: token, countryId and typeId 
router.post('/new', async (ctx) => {
    //Verify that request has required headers
    if (ctx.headers.token === undefined
        || ctx.headers.countryid === undefined
        || ctx.headers.typeid === undefined) {
        return ctx.throw(405)
    }

    //Verify user id through firebase
    // @ts-ignore
    const uid = await verifyToken(ctx.headers.token)

    const countries = await DI.countryRepository.findAll()
    //Verify data fields are valid

    // @ts-ignore
    const countryId = parseInt(ctx.headers.countryid)
    // @ts-ignore
    const typeId = parseInt(ctx.headers.typeid)

    if (countryId > countries.length || countryId < 1)
        return ctx.throw(401);
    if (typeId > 3 || typeId < 1)
        return ctx.throw(401);

    //Create Pass object
    //Seperate for semester ticket, end dates are fixed
    const date = getDateBasedOnType(typeId)
    const passId = randomUUID()
    const country = await DI.countryRepository.findOne({ id: countryId })

    //check if user already has a pass for this country
    const userPasses = await DI.passRepository.find({ ownerId: uid, country: country!!.id });

    if (country && userPasses.length === 0) {
        const pass = new UserPass(uid, country, passId, typeId, date)

        //Commit to db
        DI.em.persistAndFlush(pass)
    }
    return ctx.body = 201
})

//Deletes a pass when requested by the user
router.delete('/:passid', async (ctx) => {
    try {
        const token = ctx.headers.token
        const passid = ctx.params.passid

        if (!token) {
            ctx.throw(401)
        }

        // @ts-ignore
        const uid = await verifyToken(token)

        const passToDelete = await DI.passRepository.findOne({ passId: passid, ownerId: uid }, { populate: true })

        if (passToDelete?.ownerId == uid) {
            await DI.passRepository.removeAndFlush(passToDelete!!)
            ctx.body = 'Pass deleted successfully'
        }
        else {
            ctx.throw(401, 'Unauthorized user trying to delete a pass that they do not own')
        }
    }
    catch (error) {
        ctx.body = error;
    }
})


router.post('/seed/:passid', async (ctx) => {
    const token = ctx.headers.token
    const passid = ctx.params.passid

    try {
        if (!token) {
            ctx.throw(401)
        }
        // @ts-ignore
        const uid = await verifyToken(token)
        const passToSeed = await DI.passRepository.findOneOrFail({ passId: passid }, { populate: true })

        if (passToSeed?.ownerId == uid) {
            const trips = [
                new UserTrip('Thessaloniki', passToSeed, 'Metro'),
                new UserTrip('Athens', passToSeed, 'Metro'),
                new UserTrip('Athens', passToSeed, 'Metro'),
                new UserTrip('Athens', passToSeed, 'Tram'),
                new UserTrip('Ioannina', passToSeed, 'Metro'),
                new UserTrip('Thessaloniki', passToSeed, 'Bus'),
                new UserTrip('Ioannina', passToSeed, 'Bus'),
                new UserTrip('Ioannina', passToSeed, 'Bus'),
                new UserTrip('Ioannina', passToSeed, 'Bus'),
                new UserTrip('Thessaloniki', passToSeed, 'Tram')
            ]

            const tripsToSave = new Collection<UserTrip>(passToSeed, trips);

            wrap(passToSeed).assign({ trips: tripsToSave })

            DI.em.persistAndFlush(passToSeed);
            ctx.body = 'Pass seeded succesfully'
        }

        else {
            ctx.throw(401, 'Unauthorized user trying to seed a pass they do not own')
        }
    }
    catch (error) {
        ctx.body = error;
        console.log(error)
    }
})

/*Updates a pass's type
A type update also changes the expiration date
Weekly ticket is an easy offset of a flat 7days, a semester one has to be handled individually based on the current date
Using @DateController
*/

router.put('/update/:passid', async (ctx) => {
    const token = ctx.headers.token
    const type = ctx.headers.type
    const passid = ctx.params.passid
    try {
        if (!token || !type) {
            ctx.throw(401)
        }
        // @ts-ignore
        const uid = await verifyToken(token)
        // @ts-ignore
        const newType = parseInt(type)

        const passToUpdate = await DI.passRepository.findOneOrFail({ passId: passid })

        const newExpirationDate = getDateBasedOnType(newType)

        wrap(passToUpdate).assign({ expirationDate: newExpirationDate, type: newType })
        DI.em.persistAndFlush(passToUpdate)
        ctx.body = "Pass updated successfully"
    } catch (error) {
        ctx.throw(401, 'Unauthorized, user trying to update a pass they do not own')
        console.log(error)
    }
    ctx.body = 'ok'
})
export const UserPassesController = router;
