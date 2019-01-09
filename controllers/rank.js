const handleRank = (db) => async (req, resp) => {
	try {
		const { entries } = req.body;

		const rank = Number((await db('users')
			.count('email')
			.where('entries', '>', entries)
			.returning('*'))[0].count) + 1;

		resp.json({ rank: rank });

	} catch(err) {
		resp.status(400).json('error');
	}
}

module.exports = {
	handleRank: handleRank
}