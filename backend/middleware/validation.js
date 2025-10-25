import Joi from "joi";

// Validation schemas
const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)"))
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      }),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string()
      .min(8)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)"))
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      }),
  }),

  // Job validation schemas
  createJob: Joi.object({
    title: Joi.string().min(1).max(255).required().messages({
      "string.empty": "Job title is required",
      "string.min": "Job title cannot be empty",
      "string.max": "Job title must be 255 characters or less",
    }),
    company: Joi.string().min(1).max(255).required().messages({
      "string.empty": "Company name is required",
      "string.min": "Company name cannot be empty",
      "string.max": "Company name must be 255 characters or less",
    }),
    location: Joi.string().max(255).allow("").optional().messages({
      "string.max": "Location must be 255 characters or less",
    }),
    startDate: Joi.date().iso().required().messages({
      "date.base": "Start date must be a valid date",
      "date.format": "Start date must be in YYYY-MM-DD format",
      "any.required": "Start date is required",
    }),
    endDate: Joi.date()
      .iso()
      .greater(Joi.ref("startDate"))
      .allow(null)
      .optional()
      .messages({
        "date.base": "End date must be a valid date",
        "date.format": "End date must be in YYYY-MM-DD format",
        "date.greater": "End date must be after start date",
      }),
    isCurrent: Joi.boolean().required().messages({
      "boolean.base": "isCurrent must be true or false",
      "any.required": "isCurrent is required",
    }),
    description: Joi.string().max(1000).allow("").optional().messages({
      "string.max": "Description must be 1000 characters or less",
    }),
  })
    .custom((value, helpers) => {
      // Custom validation: if isCurrent is true, endDate must be null
      if (value.isCurrent === true && value.endDate !== null) {
        return helpers.error("custom.currentJobWithEndDate");
      }
      return value;
    })
    .messages({
      "custom.currentJobWithEndDate": "Current job cannot have an end date",
    }),

  updateJob: Joi.object({
    title: Joi.string().min(1).max(255).optional().messages({
      "string.empty": "Job title cannot be empty",
      "string.min": "Job title cannot be empty",
      "string.max": "Job title must be 255 characters or less",
    }),
    company: Joi.string().min(1).max(255).optional().messages({
      "string.empty": "Company name cannot be empty",
      "string.min": "Company name cannot be empty",
      "string.max": "Company name must be 255 characters or less",
    }),
    location: Joi.string().max(255).allow("").optional().messages({
      "string.max": "Location must be 255 characters or less",
    }),
    startDate: Joi.date().iso().optional().messages({
      "date.base": "Start date must be a valid date",
      "date.format": "Start date must be in YYYY-MM-DD format",
    }),
    endDate: Joi.date()
      .iso()
      .greater(Joi.ref("startDate"))
      .allow(null)
      .optional()
      .messages({
        "date.base": "End date must be a valid date",
        "date.format": "End date must be in YYYY-MM-DD format",
        "date.greater": "End date must be after start date",
      }),
    isCurrent: Joi.boolean().optional().messages({
      "boolean.base": "isCurrent must be true or false",
    }),
    description: Joi.string().max(1000).allow("").optional().messages({
      "string.max": "Description must be 1000 characters or less",
    }),
  })
    .custom((value, helpers) => {
      // Custom validation: if isCurrent is true, endDate must be null
      if (value.isCurrent === true && value.endDate !== null) {
        return helpers.error("custom.currentJobWithEndDate");
      }
      return value;
    })
    .messages({
      "custom.currentJobWithEndDate": "Current job cannot have an end date",
    }),

  jobId: Joi.object({
    id: Joi.string().uuid().required().messages({
      "string.guid": "Job ID must be a valid UUID",
      "any.required": "Job ID is required",
    }),
  }),
};

// Validation middleware factory
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(422).json({
        ok: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          fields: errorDetails.reduce((acc, detail) => {
            acc[detail.field] = detail.message;
            return acc;
          }, {}),
        },
      });
    }

    next();
  };
};

// Validation middleware for path parameters
export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(422).json({
        ok: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          fields: errorDetails.reduce((acc, detail) => {
            acc[detail.field] = detail.message;
            return acc;
          }, {}),
        },
      });
    }

    next();
  };
};

// Export individual validation middleware
export const validateRegister = validate(schemas.register);
export const validateLogin = validate(schemas.login);
export const validateChangePassword = validate(schemas.changePassword);

// Job validation middleware
export const validateCreateJob = validate(schemas.createJob);
export const validateUpdateJob = validate(schemas.updateJob);
export const validateJobId = validateParams(schemas.jobId);
