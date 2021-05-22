module.exports = (payload, done) => {
  if (!payload) return done(null, false);
  return done(null, payload);
};
