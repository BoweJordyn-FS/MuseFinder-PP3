const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Playlist = require('../models/Playlist');
const requireAuth = require('../middleware/requireAuth');
const pick = require('../utils/pick');

const AUTHOR_FIELDS = 'username email';

// only these can come from the client, author always comes from the token
const SUBJECT_FIELDS = [
	'spotify_id',
	'type',
	'name',
	'artist',
	'image_url',
	'spotify_url',
	'release_date',
];

// load the post and make sure it's yours
const loadOwnPost = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) return res.status(404).json({ error: 'Post not found' });
		if (!post.author.equals(req.user._id)) {
			return res.status(403).json({ error: 'Not your post' });
		}
		req.post = post;
		next();
	} catch (error) {
		next(error);
	}
};

// GET — all posts newest first. filter with ?subjectId&subjectType or ?author, page with ?limit&page
router.get('/', async (req, res, next) => {
	try {
		const { subjectId, subjectType, author } = req.query;
		const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
		const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

		const filter = {};
		if (subjectId) filter['subject.spotify_id'] = subjectId;
		if (subjectType) filter['subject.type'] = subjectType;
		if (author) filter.author = author;

		const [posts, total] = await Promise.all([
			Post.find(filter)
				.sort({ createdAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit)
				.populate('author', AUTHOR_FIELDS),
			Post.countDocuments(filter),
		]);

		res.json({ posts, total, page, limit });
	} catch (error) {
		next(error);
	}
});

// GET — single post
router.get('/:id', async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id).populate(
			'author',
			AUTHOR_FIELDS,
		);
		if (!post) return res.status(404).json({ error: 'Post not found' });
		res.json(post);
	} catch (error) {
		next(error);
	}
});

// POST — create a post
router.post('/', requireAuth, async (req, res, next) => {
	try {
		const { type, content, rating, subject } = req.body;
		const post = new Post({
			author: req.user._id,
			type,
			content,
			rating,
			subject: subject && pick(subject, SUBJECT_FIELDS),
		});
		await post.save();
		await post.populate('author', AUTHOR_FIELDS);
		res.status(201).json(post);
	} catch (error) {
		next(error);
	}
});

// PATCH — edit content or rating, author only
router.patch('/:id', requireAuth, loadOwnPost, async (req, res, next) => {
	try {
		Object.assign(req.post, pick(req.body, ['content', 'rating']));
		await req.post.save();
		await req.post.populate('author', AUTHOR_FIELDS);
		res.json(req.post);
	} catch (error) {
		next(error);
	}
});

// DELETE — author only, also pulls it out of any playlists
router.delete('/:id', requireAuth, loadOwnPost, async (req, res, next) => {
	try {
		const id = req.post._id;
		await Promise.all([
			req.post.deleteOne(),
			Playlist.updateMany({ posts: id }, { $pull: { posts: id } }),
		]);
		res.json({ message: 'Post deleted' });
	} catch (error) {
		next(error);
	}
});

module.exports = router;
