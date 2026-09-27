const mongoose = require('mongoose');
const SubjectSchema = require('./Subject');

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
		// the albums/tracks saved to this playlist
		items: [SubjectSchema],
	},
	{ timestamps: true },
);

module.exports = mongoose.model('Playlist', PlaylistSchema);
