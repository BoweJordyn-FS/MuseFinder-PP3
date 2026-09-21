const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const Post = require('../models/Post');
const requireAuth = require('../middleware/requireAuth');

const pick = (source, keys) =>
	Object.fromEntries(
		keys.filter((k) => k in source).map((k) => [k, source[k]]),
	);

// every playlist route needs a login
router.use(requireAuth);

// load the playlist and make sure it's yours
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

// GET — my playlists with post counts
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

// GET — single playlist with posts populated
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

// POST — create a playlist
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

// PATCH — rename / edit description
router.patch('/:id', loadOwnPlaylist, async (req, res, next) => {
	try {
		Object.assign(req.playlist, pick(req.body, ['name', 'description']));
		await req.playlist.save();
		res.json(req.playlist);
	} catch (error) {
		next(error);
	}
});

// DELETE — delete the playlist, posts are untouched
router.delete('/:id', loadOwnPlaylist, async (req, res, next) => {
	try {
		await req.playlist.deleteOne();
		res.json({ message: 'Playlist deleted' });
	} catch (error) {
		next(error);
	}
});

// POST — add one of your own posts to the playlist
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

// DELETE — remove a post from the playlist
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
