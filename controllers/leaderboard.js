const handleLeaderboard = (db) => async (req, resp) => {
	try {
		const data = await db.select('name', 'entries').from('users');
		resp.json(data);

	} catch(err) {
		resp.status(400).json('error');
	}
}

module.exports = {
	handleLeaderboard: handleLeaderboard
}