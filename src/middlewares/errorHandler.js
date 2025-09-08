import createError from "http-errors";

export const errorHandler = (err, req, res, next) => {
  if (createError.isHttpError(err)) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: "Something went wrong",
  });
};
