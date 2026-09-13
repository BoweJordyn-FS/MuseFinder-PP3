const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

const AUTHOR_FIELDS = 'username email';

// Only these fields may come from the client. `author` is always taken from
// the verified token, never the body.
const SUBJECT_FIELDS = [
	'spotify_id',
	'type',
	'name',
	'artist',
	'image_url',
	'spotify_url',
	'release_date',
];
const pick = (source, keys) =>
	Object.fromEntries(
		keys.filter((k) => k in source).map((k) => [k, source[k]]),
	);

// GET / — list posts, newest first.
//   ?subjectId=&subjectType=  every review of one artist/album/track
//   ?author=                  one user's posts (fills the profile page)
//   ?limit=&page=             pagination, defaults 20 / 1
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

// GET /:id — single post
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

// POST / — create. Schema validation enforces rating/subject for reviews.
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

// PATCH /:id — edit content or rating. Author only. The subject is fixed:
// a review of one album can't be turned into a review of another.
router.patch('/:id', requireAuth, async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) return res.status(404).json({ error: 'Post not found' });
		if (!post.author.equals(req.user._id)) {
			return res.status(403).json({ error: 'Not your post' });
		}

		const updates = pick(req.body, ['content', 'rating']);
		Object.assign(post, updates);
		await post.save();
		await post.populate('author', AUTHOR_FIELDS);
		res.json(post);
	} catch (error) {
		next(error);
	}
});

// DELETE /:id — author only. Also removes the post from every playlist that
// references it so populate() never returns dangling nulls.
router.delete('/:id', requireAuth, async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) return res.status(404).json({ error: 'Post not found' });
		if (!post.author.equals(req.user._id)) {
			return res.status(403).json({ error: 'Not your post' });
		}

		await Promise.all([
			post.deleteOne(),
			Playlist.updateMany({ posts: post._id }, { $pull: { posts: post._id } }),
		]);
		res.json({ message: 'Post deleted' });
	} catch (error) {
		next(error);
	}
});

module.exports = router;
