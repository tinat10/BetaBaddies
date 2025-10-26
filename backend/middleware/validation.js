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

  createEducation: Joi.object({
    school: Joi.string().max(255).required(),
    degreeType: Joi.string()
      .valid(
        "High School",
        "Associate",
        "Bachelor's",
        "Master's",
        "PhD",
        "Certificate",
        "Diploma"
      )
      .required(),
    field: Joi.string().max(255).allow(null, "").optional(),
    gpa: Joi.number().min(0).max(4.0).allow(null).optional(),
    isEnrolled: Joi.boolean().required(),
    honors: Joi.string().max(1000).allow(null, "").optional(),
  }),

  updateEducation: Joi.object({
    school: Joi.string().max(255).optional(),
    degreeType: Joi.string()
      .valid(
        "High School",
        "Associate",
        "Bachelor's",
        "Master's",
        "PhD",
        "Certificate",
        "Diploma"
      )
      .optional(),
    field: Joi.string().max(255).allow(null, "").optional(),
    gpa: Joi.number().min(0).max(4.0).allow(null).optional(),
    isEnrolled: Joi.boolean().optional(),
    honors: Joi.string().max(1000).allow(null, "").optional(),
  }),

  createSkill: Joi.object({
    skillName: Joi.string().max(100).required(),
    proficiency: Joi.string()
      .valid("Beginner", "Intermediate", "Advanced", "Expert")
      .required(),
    category: Joi.string()
      .valid("Technical", "Soft Skills", "Languages", "Industry-Specific")
      .allow(null, "")
      .optional(),
    skillBadge: Joi.string().uri().max(500).allow(null, "").optional(),
  }),

  updateSkill: Joi.object({
    proficiency: Joi.string()
      .valid("Beginner", "Intermediate", "Advanced", "Expert")
      .optional(),
    category: Joi.string()
      .valid("Technical", "Soft Skills", "Languages", "Industry-Specific")
      .allow(null, "")
      .optional(),
    skillBadge: Joi.string().uri().max(500).allow(null, "").optional(),
  }),

  createJob: Joi.object({
    title: Joi.string().max(255).required(),
    company: Joi.string().max(255).required(),
    location: Joi.string().max(255).allow(null, "").optional(),
    salary: Joi.number().min(0).allow(null).optional(),
    startDate: Joi.date().allow(null).optional(),
    endDate: Joi.date().allow(null).optional(),
    description: Joi.string().max(2000).allow(null, "").optional(),
    isCurrent: Joi.boolean().optional(),
  })
    .custom((value, helpers) => {
      // Custom validation for date logic
      if (value.startDate && value.endDate && value.endDate < value.startDate) {
        return helpers.error("date.endBeforeStart");
      }
      if (value.isCurrent && value.endDate) {
        return helpers.error("date.currentWithEndDate");
      }
      return value;
    })
    .messages({
      "date.endBeforeStart": "End date must be after start date",
      "date.currentWithEndDate": "Current job cannot have an end date",
    }),

  updateJob: Joi.object({
    title: Joi.string().max(255).optional(),
    company: Joi.string().max(255).optional(),
    location: Joi.string().max(255).allow(null, "").optional(),
    salary: Joi.number().min(0).allow(null).optional(),
    startDate: Joi.date().allow(null).optional(),
    endDate: Joi.date().allow(null).optional(),
    description: Joi.string().max(2000).allow(null, "").optional(),
    isCurrent: Joi.boolean().optional(),
  }),

  jobId: Joi.object({
    id: Joi.string().uuid().required(),
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
export const validateCreateEducation = validate(schemas.createEducation);
export const validateUpdateEducation = validate(schemas.updateEducation);
export const validateCreateSkill = validate(schemas.createSkill);
export const validateUpdateSkill = validate(schemas.updateSkill);
export const validateCreateJob = validate(schemas.createJob);
export const validateUpdateJob = validate(schemas.updateJob);
export const validateJobId = validateParams(schemas.jobId);
