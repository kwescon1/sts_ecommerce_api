const { createContainer, asClass, asValue, asFunction } = require("awilix");

// Initialize the container
const container = createContainer();

container.register({
  // Register classes with the container
  // exampleService: asClass(ExampleService).scoped(),
});

module.exports = container;
