export const notFound = (req, res, next) => {
  res.status(404);

  const error = new Error(`Not Found - ${req.originalUrl}`);

  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  let message = err.message;

  res.status(statusCode).json({
    message,
  });
};
