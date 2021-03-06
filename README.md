# mercurypass-api
A Node API for mercurypass-eu.com using Koa, MikroORM with MariaDB and Firebase

# Description
API to support CRUD operations for [mercury-eu.web.app](https://mercury-eu.web.app)  
Using Firebase Authentication

<p style="display:flex;>
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/590px-Node.js_logo.svg.png" style="width:100px;height:auto" />
<img src="https://brandslogo.net/wp-content/uploads/2015/09/nodejs-logo-vector-download.jpg" style="width:100px;height:auto" />
<img src="https://raw.githubusercontent.com/github/explore/087f23463641d25ee971402fa26e3dfb2855edb9/topics/koa/koa.png" style="width:100px;height:auto" />
<img src="https://mikro-orm.io/img/logo.svg" style="width:200px;height:auto" />
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Firebase_Logo.svg/1280px-Firebase_Logo.svg.png" style="width:200px;height:auto" />
</p>

# Technologies
* Node
* Koa Framework
* MikroORM
* Firebase Authentication

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

# Security and ENV Variables
MIKRO_ORM_TYPE = mariadb  
MIKRO_ORM_ALLOW_GLOBAL_CONTEXT = true  

DBNAME =   
MIKRO_ORM_HOST =   
PASSWORD =   
USER =   

SEED = FALSE  
ADMINTOKEN =  

FIREBASE_TYPE =   
FIREBASE_PROJECT_ID =   
FIREBASE_KEY_ID =   
FIREBASE_PRIVATE_KEY = '{"privateKey": "-----BEGIN PRIVATE KEY----- -----END PRIVATE KEY-----\n"}'  
FIREBASE_CLIENT_EMAIL =   
FIREBASE_CLIENT_ID =   
FIREBASE_AUTH_URI =   
FIREBASE_TOKEN_URI =   
FIREBASE_AUTH_PROVIDER_X509_CERT_URL =   
FIREBASE_CLIENT_X509_CERT_URL =   



