import { asyncHandler } from "./errorHandler.js";

// Middleware to check if user is authenticated
export const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({
    ok: false,
    error: {
      code: "UNAUTHORIZED",
      message: "Authentication required",
    },
  });
};

// Middleware to generate CSRF token and attach to session
export const generateCSRFToken = (req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  }
  res.locals.csrfToken = req.session.csrfToken;
  next();
};

// CSRF protection middleware
export const csrfProtection = (req, res, next) => {
  if (
    req.method === "GET" ||
    req.method === "HEAD" ||
    req.method === "OPTIONS"
  ) {
    return next();
  }

  const clientCsrfToken = req.headers["x-csrf-token"];
  const sessionCsrfToken = req.session.csrfToken;

  if (!clientCsrfToken || clientCsrfToken !== sessionCsrfToken) {
    return res.status(403).json({
      ok: false,
      error: {
        code: "CSRF_TOKEN_MISMATCH",
        message: "Invalid CSRF token",
      },
    });
  }
  next();
};

// Rate limiting middleware for authentication attempts
export const authRateLimit = (windowMs, maxAttempts) => (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const key = `auth_rate_limit_${ip}`;

  if (!req.session.rateLimit) {
    req.session.rateLimit = {};
  }

  const userLimit = req.session.rateLimit[key] || {
    count: 0,
    resetTime: now + windowMs,
  };

  if (now > userLimit.resetTime) {
    userLimit.count = 1;
    userLimit.resetTime = now + windowMs;
  } else {
    userLimit.count++;
  }

  req.session.rateLimit[key] = userLimit;

  if (userLimit.count > maxAttempts) {
    return res.status(429).json({
      ok: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many authentication attempts. Please try again later.",
      },
    });
  }

  next();
};
