const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const requireAuth = require('../middleware/requireAuth');

const pick = (source, keys) =>
	Object.fromEntries(
		keys.filter((k) => k in source).map((k) => [k, source[k]]),
	);

// Every playlist route is owner-only, so all of them share this guard.
router.use(requireAuth);

// Loads the playlist and enforces ownership. Everything below /:id relies
// on req.playlist being set here.
const loadOwnPlaylist = async (req, res, next) => {
	try {
		const playlist = await Playlist.findById(req.params.id);
		if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
		if (!playlist.owner.equals(req.user._id)) {
			return res.status(403).json({ error: 'Not your playlist' });
		}
		req.playlist = playlist;
		next();
	} catch (error) {
		next(error);
	}
};

// GET / — the signed-in user's playlists, with post counts rather than the
// full post arrays: a list view doesn't need every review body.
router.get('/', async (req, res, next) => {
	try {
		const playlists = await Playlist.find({ owner: req.user._id })
			.sort({ createdAt: -1 })
			.lean();
		res.json(
			playlists.map(({ posts, ...rest }) => ({
				...rest,
				postCount: posts.length,
			})),
		);
	} catch (error) {
		next(error);
	}
});

// GET /:id — one playlist with its posts filled in
router.get('/:id', loadOwnPlaylist, async (req, res, next) => {
	try {
		await req.playlist.populate({
			path: 'posts',
			populate: { path: 'author', select: 'username email' },
		});
		res.json(req.playlist);
	} catch (error) {
		next(error);
	}
});

// POST / — create
router.post('/', async (req, res, next) => {
	try {
		const playlist = new Playlist({
			owner: req.user._id,
			...pick(req.body, ['name', 'description']),
		});
		await playlist.save();
		res.status(201).json(playlist);
	} catch (error) {
		next(error);
	}
});

// PATCH /:id — rename / edit description
router.patch('/:id', loadOwnPlaylist, async (req, res, next) => {
	try {
		Object.assign(req.playlist, pick(req.body, ['name', 'description']));
		await req.playlist.save();
		res.json(req.playlist);
	} catch (error) {
		next(error);
	}
});

// DELETE /:id — the posts inside are untouched; they exist independently.
router.delete('/:id', loadOwnPlaylist, async (req, res, next) => {
	try {
		await req.playlist.deleteOne();
		res.json({ message: 'Playlist deleted' });
	} catch (error) {
		next(error);
	}
});

// POST /:id/posts — add one of the user's OWN posts. Two checks: the
// playlist is yours (loadOwnPlaylist) and the post is yours (here).
router.post('/:id/posts', loadOwnPlaylist, async (req, res, next) => {
	try {
		const { postId } = req.body;
		if (!postId) return res.status(400).json({ error: 'postId is required' });

		const post = await Post.findById(postId);
		if (!post) return res.status(404).json({ error: 'Post not found' });
		if (!post.author.equals(req.user._id)) {
			return res
				.status(403)
				.json({ error: 'You can only add your own posts to a playlist' });
		}
		if (req.playlist.posts.some((id) => id.equals(post._id))) {
			return res.status(409).json({ error: 'Post already in playlist' });
		}

		req.playlist.posts.push(post._id);
		await req.playlist.save();
		res.json(req.playlist);
	} catch (error) {
		next(error);
	}
});

// DELETE /:id/posts/:postId — remove from the playlist only
router.delete('/:id/posts/:postId', loadOwnPlaylist, async (req, res, next) => {
	try {
		const before = req.playlist.posts.length;
		req.playlist.posts = req.playlist.posts.filter(
			(id) => id.toString() !== req.params.postId,
		);
		if (req.playlist.posts.length === before) {
			return res.status(404).json({ error: 'Post not in playlist' });
		}
		await req.playlist.save();
		res.json(req.playlist);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
