const { createContainer, asClass, asValue, asFunction } = require("awilix");

const RegisterService = require("../services/registerService");
const RegisterController = require("../controllers/registerController");
const LoginService = require("../services/loginService");
const LoginController = require("../controllers/loginController");
const TokenService = require("../services/tokenService");
const TokenController = require("../controllers/tokenController");
const RedisService = require("../services/redisService");
const ImageService = require("../services/imageService");
const CategoryService = require("../services/categoryService");
const CategoryController = require("../controllers/categoryController");
const ProfileService = require("../services/profileService");
const ProfileController = require("../controllers/profileController");
const EmailService = require("../services/emailService");
const WishlistController = require("../controllers/wishlistController");
const WishlistService = require("../services/wishlistService");

// Initialize the container
const container = createContainer();

container.register({
  // Register classes with the container
  // exampleService: asClass(ExampleService).scoped(),

  registerService: asClass(RegisterService).scoped(),
  registerController: asClass(RegisterController).scoped(),

  loginService: asClass(LoginService).scoped(),
  loginController: asClass(LoginController).scoped(),

  redisService: asValue(RedisService),
  imageService: asValue(ImageService),
  emailService: asValue(EmailService),

  tokenService: asClass(TokenService).scoped(),
  tokenController: asClass(TokenController).scoped(),

  categoryService: asClass(CategoryService).scoped(),
  categoryController: asClass(CategoryController).scoped(),

  profileService: asClass(ProfileService).scoped(),
  profileController: asClass(ProfileController).scoped(),

  wishlistService: asClass(WishlistService).scoped(),
  wishlistController: asClass(WishlistController).scoped(),
});

module.exports = container;
