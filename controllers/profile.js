const handleProfile = (db) => async (req, resp) => {
	try {
		const { id } = req.params;

		const user = await db('users').where('id', id);
		if (user.length === 0)
			resp.status(400).json('no such id found');
		else
			resp.json(user[0]);
	} catch(err) {
		resp.status(400).json('error');
	}
}

module.exports = {
	handleProfile: handleProfile
}