module.exports = {
	// Override in production by setting JWT_SECRET in the environment.
	secret: process.env.JWT_SECRET || 'secretkey',
};
