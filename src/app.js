import dotenv from "dotenv";
dotenv.config();

import express from "express";
import router from "./routes/index.js";
import errorHandler from "./exceptions/handler.js";
import CorsMiddleware from "./middlewares/handleCors.js";
import RateLimiter from "./middlewares/rateLimiter.js";
import responseMacro from "./middlewares/response.js";
import ConvertEmptyStringsToNull from "./middlewares/ConvertEmptyStringsToNull.js";
import TrimStringsMiddleware from "./middlewares/trimStrings.js";
import container from "./config/container.js";
import AttachContainerMiddleware from "./middlewares/AttachContainer.js";
import NotFoundException from "./exceptions/notFoundException.js";

const app = express();
const corsMiddleware = new CorsMiddleware().middleware; // no options added so default options will be used
const rateLimiter = new RateLimiter().middleware; // no configured options. default options will be used

const convertEmptyStringsToNull = ConvertEmptyStringsToNull.handle;
const trimStrings = TrimStringsMiddleware.handle;
const appContainer = new AttachContainerMiddleware(container).handle;

// Define a simple route
app.get("/", (req, res) => {
  res.send("It is working");
});

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(corsMiddleware);
app.use(rateLimiter);
app.use(responseMacro);

//    TODO this.handleMaintenanceMode();

app.use(convertEmptyStringsToNull);
app.use(trimStrings);

// Apply API middleware to /api/v1 routes
app.use("/api/v1", appContainer, router);

app.all("*", (req, res, next) => {
  // Throw a NotFoundException for any undefined route
  throw new NotFoundException("The requested resource was not found");
});

app.use(errorHandler.handle);
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
