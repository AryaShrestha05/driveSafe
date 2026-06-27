// Express recognizes this as an error handler because it has 4 arguments.
// Anything passed to next(err) — or thrown in an async controller that calls
// next(err) — ends up here, so error responses stay consistent.
export function errorHandler(err, _req, res, _next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
}
