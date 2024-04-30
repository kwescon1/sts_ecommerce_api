const { createContainer, asClass, asValue, asFunction } = require("awilix");

const RegisterService = require("../services/registerService");
const RegisterController = require("../controllers/registerController");

// Initialize the container
const container = createContainer();

container.register({
  // Register classes with the container
  // exampleService: asClass(ExampleService).scoped(),

  registerService: asClass(RegisterService).scoped(),
  registerController: asClass(RegisterController).scoped(),
});

module.exports = container;
