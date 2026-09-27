const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const Post = require('../models/Post');
const SubjectSchema = require('../models/Subject');
const requireAuth = require('../middleware/requireAuth');
const pick = require('../utils/pick');

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

// GET — my playlists with counts and up to 4 covers for the card
router.get('/', async (req, res, next) => {
	try {
		const playlists = await Playlist.find({ owner: req.user._id })
			.sort({ createdAt: -1 })
			.lean();
		res.json(
			playlists.map(({ items = [], ...rest }) => ({
				...rest,
				itemCount: items.length,
				covers: items
					.map((item) => item.image_url)
					.filter(Boolean)
					.slice(0, 4),
			})),
		);
	} catch (error) {
		next(error);
	}
});

// GET — single playlist. each item gets review_id if the owner has
// reviewed it, so the card can link straight to their review
router.get('/:id', loadOwnPlaylist, async (req, res, next) => {
	try {
		const playlist = req.playlist.toObject();
		playlist.items ??= [];
		const reviews = await Post.find({
			author: req.user._id,
			'subject.spotify_id': { $in: playlist.items.map((i) => i.spotify_id) },
		})
			.select('subject.spotify_id')
			.lean();

		const bySpotifyId = new Map(
			reviews.map((post) => [post.subject.spotify_id, post._id]),
		);
		playlist.items = playlist.items.map((item) => ({
			...item,
			review_id: bySpotifyId.get(item.spotify_id) ?? null,
		}));
		res.json(playlist);
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

// DELETE — delete the playlist, reviews are untouched
router.delete('/:id', loadOwnPlaylist, async (req, res, next) => {
	try {
		await req.playlist.deleteOne();
		res.json({ message: 'Playlist deleted' });
	} catch (error) {
		next(error);
	}
});

// POST — save an album/track to the playlist
router.post('/:id/items', loadOwnPlaylist, async (req, res, next) => {
	try {
		const subject = pick(req.body.subject ?? req.body, SubjectSchema.statics.FIELDS);
		if (!subject.spotify_id) {
			return res.status(400).json({ error: 'subject is required' });
		}
		if (
			req.playlist.items.some((i) => i.spotify_id === subject.spotify_id)
		) {
			return res.status(409).json({ error: 'Already in this playlist' });
		}

		req.playlist.items.push(subject);
		await req.playlist.save();
		res.json(req.playlist);
	} catch (error) {
		next(error);
	}
});

// DELETE — take an album/track back out
router.delete('/:id/items/:spotifyId', loadOwnPlaylist, async (req, res, next) => {
	try {
		const before = req.playlist.items.length;
		req.playlist.items = req.playlist.items.filter(
			(i) => i.spotify_id !== req.params.spotifyId,
		);
		if (req.playlist.items.length === before) {
			return res.status(404).json({ error: 'Not in this playlist' });
		}
		await req.playlist.save();
		res.json(req.playlist);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
