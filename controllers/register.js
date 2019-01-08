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

				if (user.length === 0)
					throw new Error('Email already exists');

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
		error += 'Invalid Name<br/>';
	if (!(0 < email.lastIndexOf('@') && email.lastIndexOf('@') + 1 < email.lastIndexOf('.') && email.lastIndexOf('.') + 1 < email.length))
		error += 'Invalid Email Address<br/>';
	if (password.length < 10 || password.length > 30)
		error += 'Invalid Password<br/>';
	if (error !== '')
		throw new Error(error.slice(0, error.length - 5));
}

module.exports = {
	handleRegister: handleRegister
}