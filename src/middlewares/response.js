//middleware/responseMacro.js // define app responses

const { StatusCodes } = require("http-status-codes");

function responseMacro(req, res, next) {
  res.success = (data, message = "") => {
    return res.status(StatusCodes.OK).json({
      success: true,
      data: data ?? null,
      message: message,
    });
  };

  res.created = (data, message = "Created") => {
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message,
      data: data ?? null,
    });
  };

  res.notFound = (error) => {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      error,
    });
  };

  res.error = (error, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) => {
    return res.status(statusCode).json({
      success: false,
      error,
    });
  };

  res.serviceUnavailable = (message = "Service Unavailable") => {
    return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
      success: false,
      message,
    });
  };

  next();
}

module.exports = responseMacro;
