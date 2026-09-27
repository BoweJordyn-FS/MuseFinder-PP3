// copy only the given keys off an object, for whitelisting req.body
module.exports = (source = {}, keys) =>
	Object.fromEntries(keys.filter((k) => k in source).map((k) => [k, source[k]]));
