const Clarifai =  require('clarifai');

const app = new Clarifai.App({
  apiKey: '5bcab0356f10424db3014cf7c7dcfb53'
});

const handleImage = (db) => async (req, resp) => {
	try {
		const { id, imageUrl } = req.body;

		const response = await app.models.predict(
          Clarifai.FACE_DETECT_MODEL, imageUrl);
		
		const entries = await db('users')
		.where('id', id)
		.increment('entries', 1)
		.returning('entries');

		if (entries.length === 0)
			resp.status(400).json('invalid user id');
		else {
			const count = Number(entries[0]);
			resp.json({
				clarifai: response,
				count: count
			});
		}
	} catch(err) {
		resp.status(400).json('error');
	}
}

module.exports = {
	handleImage: handleImage
}