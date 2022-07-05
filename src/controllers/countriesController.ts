import Router from 'koa-router'
import { Context } from 'koa';

import { DI } from '../server'

const router = new Router()


router.get('/', async (ctx: Context) => {
    try {
        return ctx.body = await DI.countryRepository.findAll()
    } catch (e) {
        console.error(e);
        return ctx.throw(400, { message: e.message });
    }
});

router.get('/schema', async (ctx: Context) => {
    try {
        const schema = {
            id!: 'number',
            name: 'string',
            abbreviation: 'string',
            cities: 'string',
            image: 'string',
        }
        return ctx.body = schema
    } catch (e) {
        console.error(e);
        return ctx.throw(400, { message: e.message });
    }
})

router.get('/:ab', async (ctx: Context) => {
    try {
        const details = await DI.countryRepository.findOne({ abbreviation: ctx.params.ab })
        if (!details) {
            return ctx.throw(404, { message: 'Country not found' });
        }
        return ctx.body = details;
    } catch (e) {
        console.error(e);
        return ctx.throw(400, { message: e.message });
    }
})


export const CountriesController = router;