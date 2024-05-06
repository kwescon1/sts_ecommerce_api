const dotenv = require("dotenv");
dotenv.config();
const config = require("./config/config.js");

const express = require("express");
const app = express();

app.set("trust proxy", 1);

const router = require("./routes/index.js");
const errorHandler = require("./exceptions/handler.js");
const CorsMiddleware = require("./middlewares/handleCors.js");
const RateLimiter = require("./middlewares/rateLimiter.js");
const responseMacro = require("./middlewares/response.js");
const ConvertEmptyStringsToNull = require("./middlewares/ConvertEmptyStringsToNull.js");
const TrimStringsMiddleware = require("./middlewares/trimStrings.js");
const HelmetConfig = require("./middlewares/helmet.js");
const container = require("./config/container.js");
const AttachContainerMiddleware = require("./middlewares/AttachContainer.js");
const NotFoundException = require("./exceptions/notFoundException.js");

// Security first
app.use(HelmetConfig.getMiddleware());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares for request handling
app.use(new CorsMiddleware().middleware);
app.use(new RateLimiter().middleware);
app.use(responseMacro);
app.use(ConvertEmptyStringsToNull.handle);
app.use(TrimStringsMiddleware.handle);
app.use(new AttachContainerMiddleware(container).handle);

// Route groupings
app.use("/api/v1", router);

// Catch-all for undefined routes
app.all("*", (req, res, next) => {
  throw new NotFoundException("The requested resource was not found");
});

// Error handling
app.use(errorHandler.handle);

// Server initialization
const port = config.app.port || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
