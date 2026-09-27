const mongoose = require('mongoose');
const SubjectSchema = require('./Subject');

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

PostSchema.index({ 'subject.spotify_id': 1, 'subject.type': 1, createdAt: -1 });

module.exports = mongoose.model('Post', PostSchema);
