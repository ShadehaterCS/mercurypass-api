//ENDPOINT api/admin
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { admin, DI, } from '../server'

import Router from "koa-router";
import { Country } from '../entities/Country';
import { wrap } from '@mikro-orm/core';
import { UserTrip } from '../entities/UserTrip';
const router = new Router()

export async function verifyAdminToken(token: string) {
    return await admin.auth()
        .verifyIdToken(token)
        .then((decodedToken: DecodedIdToken) => {
            const uid = decodedToken.uid;
            if (uid === process.env.ADMINTOKEN)
                return true;
            else
                return false
        })
        .catch((error: string) => {
            console.log(error)
            return null
        });
}

//@returns all users
router.get('/users', async (ctx) => {
    try {
        //@ts-ignore
        const isAdmin = await verifyAdminToken(ctx.headers.token)
        if (isAdmin) {
            // List batch of users, 1000 at a time.
            const users = await admin.auth()
                .listUsers(1000)
                .then((listUsersResult: any) => {
                    return listUsersResult.users
                })
                .catch((error: Error) => {
                    console.log('Error listing users:', error);
                });
            ctx.body = users;
        } else {
            ctx.throw(401, 'Not admin')
        }

    }
    catch (error) {
        ctx.throw(401)
    }
})

router.delete('/users/:userid', async (ctx) => {
    try {
        //@ts-ignore
        const isAdmin = await verifyAdminToken(ctx.headers.token)
        const uid = ctx.params.userid

        if (isAdmin) {
            const passes = await DI.passRepository.find({ ownerId: uid }, { populate: true })
            await admin.auth()
                .deleteUser(uid)
                .then(() => {
                    console.log('Successfully deleted user');
                })
                .catch((error: any) => {
                    console.log('Error deleting user:', error);
                });
            if (passes) {
                await DI.em.removeAndFlush(passes)
            }
            ctx.status = 200
        }
        else {
            ctx.throw(401)
        }
    } catch (error) {
        console.log(error)
        ctx.throw(404)
    }
})


//updates a country's cities, imageSRC and prices
router.put('/country/edit/', async (ctx) => {
    try {
        //@ts-ignore
        const isAdmin = await verifyAdminToken(ctx.headers.token)
        const data: Country = ctx.request.body
        console.log(data)
        if (isAdmin) {
            const countryToEdit = await DI.countryRepository.findOneOrFail({ id: Number(data.id) })
            if (!countryToEdit) {
                ctx.throw(404)
            }
            else {
                wrap(countryToEdit).assign({
                    cities: data.cities,
                    repeat: Number(data.repeat),
                    weekly: Number(data.weekly),
                    semester: Number(data.semester)
                })
                DI.em.persistAndFlush(countryToEdit)
                ctx.status = 201
            }
        }
        else {
            ctx.throw(401)
        }
    } catch (error) {
        console.log(error)
    }
})

//creates a new country
router.post('/country/new', async (ctx) => {
    const data = ctx.request.body
    try {
        //@ts-ignore
        const isAdmin = await verifyAdminToken(ctx.headers.token)
        // const countryId = ctx.params.countryid
        if (isAdmin) {
            const newCountry = new Country(
                data.name,
                data.abbreviation,
                data.cities,
                data.image,
                Number(data.repeat),
                Number(data.weekly),
                Number(data.semester));
            DI.countryRepository.persistAndFlush(newCountry)
            ctx.status = 200
        }
    } catch (error) {
        console.log(error)
        ctx.throw(401)
    }
})

router.get('/stats', async (ctx) => {
    // const data = ctx.request.body
    try {
        //@ts-ignore
        const isAdmin = await verifyAdminToken(ctx.headers.token)
        // const countryId = ctx.params.countryid
        if (isAdmin) {
            const users = await admin.auth()
                .listUsers(1000)
                .then((listUsersResult: any) => {
                    return listUsersResult.users
                })
                .catch((error: Error) => {
                    console.log('Error listing users:', error);
                });

            const temp = users.map((u: { uid: any }) => u.uid)
            const countries = (await DI.countryRepository.findAll()).map(c => c.name)
            const passes = (await DI.passRepository.findAll()).length
            const messages = await DI.messageRepository.findAll()
            const trips = (await DI.em.find(UserTrip, {})).length
            console.log(trips)
            ctx.body = {
                users: {
                    count: users.length,
                    users: temp
                },
                countries: {
                    count: countries.length,
                    countries: countries
                },
                passes: passes,
                trips: trips,
                messages: {
                    count: messages.length,
                    messages: messages
                }
            }
        }
    } catch (error) {
        console.log(error)
        ctx.throw(401)
    }
})




export const AdminController = router