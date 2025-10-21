// Async handler wrapper to catch errors in async route handlers
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Centralized error handler
export const errorHandler = (err, req, res, next) => {
  console.error("🚨 API Error:", err);

  // Database constraint errors
  if (err.code === "23505") {
    // Unique constraint violation
    return res.status(409).json({
      ok: false,
      error: {
        code: "CONFLICT",
        message: "A resource with this information already exists",
        fields: {
          email: "A user with this email address already exists",
        },
      },
    });
  }

  if (err.code === "23503") {
    // Foreign key constraint violation
    return res.status(400).json({
      ok: false,
      error: {
        code: "INVALID_REFERENCE",
        message: "Referenced resource does not exist",
      },
    });
  }

  if (err.code === "23514") {
    // Check constraint violation
    return res.status(422).json({
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Data validation failed",
      },
    });
  }

  // Custom error handling based on error messages
  if (err.message === "UNAUTHORIZED") {
    return res.status(401).json({
      ok: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required",
      },
    });
  }

  if (err.message === "FORBIDDEN") {
    return res.status(403).json({
      ok: false,
      error: {
        code: "FORBIDDEN",
        message: "Access denied",
      },
    });
  }

  if (err.message === "INVALID_TOKEN") {
    return res.status(401).json({
      ok: false,
      error: {
        code: "INVALID_TOKEN",
        message: "Invalid authentication token",
      },
    });
  }

  if (err.message === "TOKEN_EXPIRED") {
    return res.status(401).json({
      ok: false,
      error: {
        code: "TOKEN_EXPIRED",
        message: "Authentication token has expired",
      },
    });
  }

  if (err.message === "VALIDATION_ERROR") {
    return res.status(422).json({
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: err.message,
      },
    });
  }

  if (err.message === "RATE_LIMIT_EXCEEDED") {
    return res.status(429).json({
      ok: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests. Please try again later.",
      },
    });
  }

  // Default to 500 Internal Server Error
  res.status(500).json({
    ok: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    },
  });
};

// 404 handler
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    ok: false,
    error: {
      code: "NOT_FOUND",
      message: "The requested resource was not found",
    },
  });
};
