const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const rank = require('./controllers/rank');

// GLOBAL VARIABLES
const db = knex({
	client: 'pg',
	connection: {
		connectionString: process.env.DATABASE_URL || "postgres://aqyxabavovjtpt:aea2507907763fb36c0c9189e54a0fc494daa1899cc10abccc78fe3ecc0efe39@ec2-54-225-121-235.compute-1.amazonaws.com:5432/d9n4orc14nlao4",
		ssl: true,
	}
});

const app = express();

const DEBUG = true;

const PORT = process.env.PORT || 3001;
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
app.post('/rank', rank.handleRank(db));
app.get('/profile/:id', profile.handleProfile(db));
app.put('/image', image.handleImage(db));
// --

// START SERVER
app.listen(PORT, () => {
	console.log(`app is running on port ${PORT}`);
});