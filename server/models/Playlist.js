const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema(
	{
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		name: { type: String, required: true, trim: true, maxlength: 100 },
		description: { type: String, maxlength: 500 },
		posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Playlist', PlaylistSchema);
