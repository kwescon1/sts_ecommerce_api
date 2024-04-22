import dotenv from "dotenv";
dotenv.config();

import express from "express";
import errorHandler from "./exceptions/handler.js";
import CorsMiddleware from "./middlewares/handleCors.js";
import RateLimiter from "./middlewares/rateLimiter.js";
import responseMacro from "./middlewares/response.js";
import ConvertEmptyStringsToNull from "./middlewares/ConvertEmptyStringsToNull.js";
import TrimStringsMiddleware from "./middlewares/trimStrings.js";
import container from "./config/container.js";
import AttachContainerMiddleware from "./middlewares/AttachContainer.js";

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
app.use(appContainer);

app.use(errorHandler.handle);
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
