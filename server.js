const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

const PORT_NUM = 3000;
const database = {
	users: [
		{
			id: '0',
			name: 'ariq',
			email: 'ariq@test.com',
			//password: 'lstp',
			entries: 0,
			joined: new Date()
		},
		{
			id: '1',
			name: 'mdzkm',
			email: 'dzikra@test.com',
			//password: 'allyoucanbuy',
			entries: 0,
			joined: new Date()
		},
	],
	login: [
		{
			id: '0',
			hash: '$2a$10$J9YMSFbCrL.cp/WJdIrqR.dUrRZ2eb9N7B7/Vq80f6gMhENeEk9tC',
			email: 'ariq@test.com'
		},
		{
			id: '1',
			hash: '$2a$10$ZZxhGRN6RafNWh/l4Dg/U.4lttf2ksWu1gKeHGiiiZsUpxwlm3cki',
			email: 'dzikra@test.com'
		},
	]
}

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, resp) => {
	resp.json(database.users);
})

app.post('/signin', (req, resp) => {
	let userid = checkUser(req.body.email, req.body.password);
	if (userid !== '-1') {
		resp.json(findId(userid));
	}
	else
		resp.json('failed');
})

app.post('/register', (req, resp) => {
	try {
		const { name, email, password } = req.body;
		createNewUser(name, email, password);
		resp.json(database.users[database.users.length - 1]);
	} catch(err) {
		resp.json('failed');
	}
})

app.get('/profile/:id', (req, resp) => {
	const { id } = req.params;
	let user = findId(id);
	if (user === null)
		resp.status(404).json('no such id found');
	else
		resp.json(user);
})

app.put('/image', (req, resp) => {
	const { id } = req.body;
	let user = findId(id);
	if (user === null)
		resp.status(404).json('no such id found');
	else {
		resp.json(++user.entries);
	}
})

function findId(userid) {
	let res = null;
	database.users.some(user => {
		if (user.id === userid) {
			res = user;
			return true;
		}
		return false;
	});
	return res;
}

function createNewUser(name, email, password) {
	const newId = String(Number(database.users[database.users.length - 1].id) + 1);
	bcrypt.hash(password, null, null, (err, hash) => {
	    database.login.push({
	    	id: newId,
	    	email: email,
	    	hash: hash
	    });
	});
	database.users.push({
		id: newId,
		name: name,
		email: email,
		entries: 0,
		joined: new Date()
	});
}

function checkUser(email, password) {
	let userid = '-1';
	database.login.some(user => {
		if (user.email === email) {
			if (bcrypt.compareSync(password, user.hash))
				userid = user.id;
			return true;
		}
		return false;
	})
	return userid;
}


// START SERVER
app.listen(PORT_NUM, () => {
	console.log('app is running on port ' + PORT_NUM);
});


/*

NOTES

/ -> GET -> working
/signin -> (email, pass) POST -> success, fail
/register -> (name, email, pass) POST -> user
/profile/:userid -> GET -> user
/image -> PUT -> user

*/