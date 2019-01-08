const handleIndex = (db) => (req, resp) => {
	db.select('*').from('users').then(user => {
		resp.json(user);
	});
}

module.exports = {
	handleIndex: handleIndex
}