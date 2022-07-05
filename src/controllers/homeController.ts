import Router from 'koa-router'
const router = new Router()

router.get('/', async (ctx) => {
    const response = {
        'Welcome': 'This is the api for Merucry-eu. Its access is restricted and every personal response needs a valid id token',
    }
    ctx.body = response
});

export const HomeController = router;