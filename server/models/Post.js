const mongoose = require('mongoose');

// The Spotify entity a review is about. Fields are a snapshot of what
// /spotify/v1/search returns, so a post can render without a second
// Spotify call. spotify_id is the stable key for "all reviews of X".
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

const PostSchema = new mongoose.Schema(
	{
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		type: {
			type: String,
			enum: ['review', 'concert', 'event', 'general'],
			default: 'review',
		},
		content: { type: String, required: true, maxlength: 5000 },
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: function () {
				return this.type === 'review';
			},
		},
		subject: {
			type: SubjectSchema,
			required: function () {
				return this.type === 'review';
			},
		},
	},
	{ timestamps: true },
);

// Hottest query: every review of a given artist/album/track, newest first.
PostSchema.index({ 'subject.spotify_id': 1, 'subject.type': 1, createdAt: -1 });

module.exports = mongoose.model('Post', PostSchema);
