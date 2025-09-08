import { HttpError } from "http-errors";

export const errorHandler = (err, req, res, next) => {
  // Якщо це помилка з createHttpError
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.name, 
      data: err,       
    });
    return;
  }

  // Якщо це звичайна помилка (не з createHttpError)
  res.status(500).json({
    status: 500,
    message: "Something went wrong",
    data: err.message,
  });
};
