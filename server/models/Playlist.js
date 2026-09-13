const mongoose = require('mongoose');

// A user-curated collection of their own reviews. Posts are referenced,
// not embedded: a review exists on its own and can sit in several
// playlists at once. Array order doubles as display order.
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
