const handleIndex = (db) => (req, resp) => {
	// db.select('*').from('users').then(user => {
	// 	resp.json(user);
	// });
	resp.json("IT'S WORKING!");
}

module.exports = {
	handleIndex: handleIndex
}