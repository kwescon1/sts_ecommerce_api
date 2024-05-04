const { createContainer, asClass, asValue, asFunction } = require("awilix");

const RegisterService = require("../services/registerService");
const RegisterController = require("../controllers/registerController");
const LoginService = require("../services/loginService");
const LoginController = require("../controllers/loginController");
const TokenService = require("../services/tokenService");
const TokenController = require("../controllers/tokenController");

// Initialize the container
const container = createContainer();

container.register({
  // Register classes with the container
  // exampleService: asClass(ExampleService).scoped(),

  registerService: asClass(RegisterService).scoped(),
  registerController: asClass(RegisterController).scoped(),

  loginService: asClass(LoginService).scoped(),
  loginController: asClass(LoginController).scoped(),

  tokenService: asClass(TokenService).scoped(),
  tokenController: asClass(TokenController).scoped(),
});

module.exports = container;
