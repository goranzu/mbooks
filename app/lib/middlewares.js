import { UnauthorizedError } from "./errors";

function onError(err, req, res) {
  console.error(err);
  res.status(err.statusCode || 500).json({
    error: {
      path: req.url,
      message: err.message,
      stack: process.env.NODE_ENV === "development" && err.stack,
    },
  });
}

function protect(req, res, next) {
  const user = req.session.get("user");

  if (user == null) {
    throw new UnauthorizedError();
  }

  req.userId = user.id;
  next();
}

export { onError, protect };
