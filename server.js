const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// GLOBAL VARIABLES
// const db = knex({
// 	client: 'pg',
// 	connection: {
// 		host : '127.0.0.1',
// 		user : 'postgres',
// 		password : 'nyancat01',
// 		database : 'smart-brain'
// 	}
// });

const db = {};

const app = express();

const DEBUG = true;

const PORT = (process.env.PORT ? process.env.PORT : 3000);
// --

// MIDDLEWARE
app.use(bodyParser.json());
app.use(cors());
// --

// For Debugging only
if (DEBUG) {
	const index = require('./controllers/index');
	app.get('/', index.handleIndex(db));
}
// --

// ROUTING
app.post('/signin', signin.handleSignIn(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));
app.get('/profile/:id', profile.handleProfile(db));
app.put('/image', image.handleImage(db));
// --

// START SERVER
app.listen(PORT, () => {
	console.log(`app is running on port ${PORT}`);
});