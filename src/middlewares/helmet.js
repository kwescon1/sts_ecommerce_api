const helmet = require("helmet");

class HelmetConfig {
  constructor(options = {}) {
    this.options = {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"], // Restrict all content to sources you trust
          baseUri: ["'self'"],
          blockAllMixedContent: [],
          fontSrc: ["'self'", "https:", "data:"],
          frameAncestors: ["'self'"], // Prevents this content from being embedded in other sites
          imgSrc: ["'self'", "data:"],
          objectSrc: ["'none'"],
          scriptSrc: ["'self'"],
          scriptSrcAttr: ["'none'"],
          styleSrc: ["'self'", "https:", "'unsafe-inline'"],
          upgradeInsecureRequests: [],
        },
      },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      hsts: {
        maxAge: 63072000, // Set to two years
        includeSubDomains: true,
        preload: true,
      },
      frameguard: {
        action: "deny",
      },
      dnsPrefetchControl: {
        allow: false,
      },
      xssFilter: false,
      ...options,
    };
  }

  getMiddleware() {
    return helmet(this.options);
  }
}

module.exports = new HelmetConfig();
