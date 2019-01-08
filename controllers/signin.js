const handleSignIn = (db, bcrypt) => (req, resp) => {
	const { email, password } = req.body;
	
	db('login').select('email', 'hash')
	.where('email', email)
	.then(data => {
		if (data.length === 1 && email === data[0].email && bcrypt.compareSync(password, data[0].hash)) {
			db('users').where('email', email)
			.then(user => {
				resp.json(user[0]);
			})
		}
		else
			throw 'failed login';
	})
	.catch(err => {
		resp.json('failed');
	});
}

module.exports = {
	handleSignIn: handleSignIn
}