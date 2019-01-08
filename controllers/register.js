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
					throw new Error('unable to register');

				await trx.commit();
				resp.json(user[0]);

			} catch(err) {
				await trx.rollback();
			}
		});
	} catch(err) {
		resp.status(400).json('failed');
	}
}

module.exports = {
	handleRegister: handleRegister
}