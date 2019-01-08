const handleRegister = (db, bcrypt) => async (req, resp) => {
	try {
		const { name, email, password } = req.body;

		const hash = await new Promise((resolve, reject) => {
			bcrypt.hash(password, null, null, (err, hash) => {
				if (err)
					reject(err);
				resolve(hash);
			});
		});

		if ((await db('login').where('email', email)).length >= 1)
			throw new Error('Email already exists');

		checkData(name, email, password);

		await db.transaction(async trx => {
			try {
				await trx('login')
				.insert({
					hash: hash,
					email: email
				})

				const user = await trx('users')
				.insert({
					email: email,
					name: name,
					joined: new Date()
				})
				.returning('*');

				await trx.commit();
				resp.json(user[0]);

			} catch(err) {
				await trx.rollback();
			}
		});
	} catch(err) {
		resp.status(400).json(err.message);
	}
}

const checkData = (name, email, password) => {
	let error = '';
	if (name === '')
		error += 'Invalid Name\n';
	if (!(0 < email.lastIndexOf('@') && email.lastIndexOf('@') + 1 < email.lastIndexOf('.') && email.lastIndexOf('.') + 1 < email.length))
		error += 'Invalid Email Address\n';
	if (password.length < 10 || password.length > 30)
		error += 'Invalid Password\n';
	if (error !== '')
		throw new Error(error.slice(0, error.length - 1));
}

module.exports = {
	handleRegister: handleRegister
}