import 'reflect-metadata';

import Koa, { Context } from 'koa'
import bodyparser from 'koa-bodyparser'
import cors from '@koa/cors'

import 'dotenv/config'
import { Country, UserPass, Message } from './entities/exports'

// import firebase-admin package
export const admin = require('firebase-admin');

const serviceAccount =
{
  "type": process.env.FIREBASE_TYPE,
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_KEY_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY,
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": process.env.FIREBASE_AUTH_URI,
  "token_uri": process.env.FIREBASE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL
}

// Intialize the firebase-admin project/account
export const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

//MIKRO ORM
export const DI = {} as {
  orm: MikroORM,
  em: EntityManager,
  passRepository: EntityRepository<UserPass>,
  countryRepository: EntityRepository<Country>,
  messageRepository: EntityRepository<Message>,
};

//Import controllers
import { HomeController, UserPassesController, CountriesController, ScanController, MessagesController, AdminController } from './controllers';
import Router from 'koa-router';

import { EntityManager, EntityRepository, MikroORM, RequestContext } from '@mikro-orm/core';
import { DatabaseSeeder } from './seeders/database.seeder';

//Use controllers for routing
const api = new Router();
api.get('/', (ctx: Context) => ctx.body = { message: 'Welcome to the Mercury API' });
api.use('/api', HomeController.routes())
api.use('/api/passes', UserPassesController.routes())
api.use('/api/countries', CountriesController.routes())
api.use('/api/scan', ScanController.routes())
api.use('/api/messages', MessagesController.routes())
api.use('/api/admin', AdminController.routes())

//Application start
const PORT = (process.env.PORT || 5555)
export const app = new Koa();
import config from './mikro-orm.config'

(async () => {
  //@ts-ignore
  DI.orm = await MikroORM.init(config)
  DI.em = DI.orm.em;

  DI.passRepository = DI.orm.em.getRepository(UserPass);
  DI.countryRepository = DI.orm.em.getRepository(Country);
  DI.messageRepository = DI.orm.em.getRepository(Message);


  if (process.env.SEED == 'TRUE') {
    console.log("SEEDING DATABASE")
    const seeder = DI.orm.getSeeder()
    await DI.orm.getSchemaGenerator().refreshDatabase();
    await seeder.seed(DatabaseSeeder)
  }

  app.use(cors({
    origin: "*"
  }))

  app.use(bodyparser());
  app.use(api.routes());
  app.use(api.allowedMethods());
  app.use((_ctx, next) => RequestContext.createAsync(DI.orm.em, next));
  app.use((ctx) => {
    ctx.throw(404, 'No route found, we are sorry :(')
  });

  //Get all routes
  //console.log(api.stack.map(i => i.path));
  app.listen(PORT, async () => {
    console.log("Mercury server listening at " + PORT)
  }).on("error", err => {
    console.log(err)
  })
})()
