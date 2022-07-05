# mercurypass-api
A Node API for mercurypass-eu.com using Koa, MikroORM with MariaDB and Firebase

# Description
API to support CRUD operations for [mercury-eu.web.app](https://mercury-eu.web.app)  
Using Firebase Authentication

# Technologies
* Node
* Koa Framework
* MikroORM
* Firebase Authentication
* Docker

# Hosting
* API Hosted on Heroku
* MariaDB on AWS
* Site hosted through Firebase Hosting

# Routes
In order to use the routes you need to be logged in. When logged in you are given a session token through Firebase Auth that is sent with every request
| Method | Route                     |
|--------|---------------------------|
| GET    | /api/passes/user/         |
| GET    | /api/passes/:passId       |  
| POST   | /api/passes/new           |  
| DELETE | /api/passes/:passid       |  
| POST   | api/passes/seed/:passid   | 
| PUT    | api/passes/update/:passid |
| GET    | /api/admin/users         |  
| DELETE | /api/admin/users/:userid | 
| PUT    | /api/admin/country/edit/ |
| POST   | /api/admin/country/new   |
| GET    | /api/admin/stats         |


