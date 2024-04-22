import { createContainer, asClass, asValue, asFunction } from "awilix";

// Initialize the container
const container = createContainer();

container.register({
  // Register classes with the container
  // exampleService: asClass(ExampleService).scoped(),
});

export default container;
