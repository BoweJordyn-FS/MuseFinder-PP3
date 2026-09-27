const mongoose = require('mongoose');

// an album/track/artist from spotify. posts review one, playlists collect them
const SubjectSchema = new mongoose.Schema(
	{
		spotify_id: { type: String, required: true },
		type: {
			type: String,
			enum: ['artist', 'album', 'track'],
			required: true,
		},
		name: { type: String, required: true },
		artist: String,
		image_url: String,
		spotify_url: String,
		release_date: String,
	},
	{ _id: false },
);

// the fields a client is allowed to send
SubjectSchema.statics.FIELDS = [
	'spotify_id',
	'type',
	'name',
	'artist',
	'image_url',
	'spotify_url',
	'release_date',
];

module.exports = SubjectSchema;
