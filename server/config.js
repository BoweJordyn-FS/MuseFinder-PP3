const secret = process.env.JWT_SECRET;

// No fallback on purpose: a committed default secret lets anyone forge tokens.
if (!secret) {
	throw new Error(
		'JWT_SECRET is not set. Copy .env.dist to .env and set a value.',
	);
}

module.exports = { secret };
