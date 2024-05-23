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
const ProductController = require("../controllers/productController");
const ProductService = require("../services/productService");
const StockController = require("../controllers/stockController");
const StockService = require("../services/stockService");
const CartController = require("../controllers/cartController");
const CartService = require("../services/cartService");
const CheckoutController = require("../controllers/checkoutController");
const CheckoutService = require("../services/checkoutService");
const TransactionController = require("../controllers/transactionController");
const TransactionService = require("../services/transactionService");

const OrderController = require("../controllers/orderController");
const OrderService = require("../services/orderService");

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

  productService: asClass(ProductService).scoped(),
  productController: asClass(ProductController).scoped(),

  stockService: asClass(StockService).scoped(),
  stockController: asClass(StockController).scoped(),

  cartService: asClass(CartService).scoped(),
  cartController: asClass(CartController).scoped(),

  checkoutService: asClass(CheckoutService).scoped(),
  checkoutController: asClass(CheckoutController).scoped(),

  transactionService: asClass(TransactionService).scoped(),
  transactionController: asClass(TransactionController).scoped(),

  orderService: asClass(OrderService).scoped(),
  orderController: asClass(OrderController).scoped(),
});

module.exports = container;
