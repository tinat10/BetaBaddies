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

  deleteAccount: Joi.object({
    password: Joi.string().min(8).required().messages({
      "string.empty": "Password is required to delete account",
      "string.min": "Password must be at least 8 characters",
      "any.required": "Password is required to delete account",
    }),
    confirmationText: Joi.string()
      .valid("DELETE MY ACCOUNT")
      .required()
      .messages({
        "any.only": 'You must type "DELETE MY ACCOUNT" to confirm deletion',
        "any.required": "Confirmation text is required",
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

  createCertification: Joi.object({
    name: Joi.string().max(255).required(),
    orgName: Joi.string().max(255).required(),
    dateEarned: Joi.date().required(),
    expirationDate: Joi.date().allow(null).optional(),
    neverExpires: Joi.boolean().default(false),
  })
    .custom((value, helpers) => {
      // Custom validation for certification date logic
      const earnedDate = new Date(value.dateEarned);
      const today = new Date();

      // Check if date earned is in the future
      if (earnedDate > today) {
        return helpers.error("certification.futureDate");
      }

      if (value.neverExpires && value.expirationDate) {
        return helpers.error("certification.permanentWithExpiration");
      }
      if (!value.neverExpires && !value.expirationDate) {
        return helpers.error("certification.expiringWithoutDate");
      }
      if (
        value.expirationDate &&
        value.dateEarned &&
        value.expirationDate <= value.dateEarned
      ) {
        return helpers.error("certification.expirationBeforeEarned");
      }
      return value;
    })
    .messages({
      "certification.futureDate": "Date earned cannot be in the future",
      "certification.permanentWithExpiration":
        "Permanent certifications cannot have an expiration date",
      "certification.expiringWithoutDate":
        "Non-permanent certifications must have an expiration date",
      "certification.expirationBeforeEarned":
        "Expiration date must be after date earned",
    }),

  updateCertification: Joi.object({
    name: Joi.string().max(255).optional(),
    orgName: Joi.string().max(255).optional(),
    dateEarned: Joi.date().optional(),
    expirationDate: Joi.date().allow(null).optional(),
    neverExpires: Joi.boolean().optional(),
  })
    .custom((value, helpers) => {
      // Custom validation for certification date logic
      if (value.neverExpires && value.expirationDate) {
        return helpers.error("certification.permanentWithExpiration");
      }
      if (
        value.expirationDate &&
        value.dateEarned &&
        value.expirationDate <= value.dateEarned
      ) {
        return helpers.error("certification.expirationBeforeEarned");
      }
      return value;
    })
    .messages({
      "certification.permanentWithExpiration":
        "Permanent certifications cannot have an expiration date",
      "certification.expirationBeforeEarned":
        "Expiration date must be after date earned",
    }),

  certificationId: Joi.object({
    id: Joi.string().uuid().required(),
  }),

  fileId: Joi.object({
    fileId: Joi.string().uuid().required(),
  }),

  createProject: Joi.object({
    name: Joi.string().max(255).required(),
    link: Joi.string().uri().max(500).allow(null, "").optional(),
    description: Joi.string().max(500).allow(null, "").optional(),
    startDate: Joi.date().required(),
    endDate: Joi.date().allow(null).optional(),
    technologies: Joi.string().max(500).allow(null, "").optional(),
    collaborators: Joi.string().max(255).allow(null, "").optional(),
    status: Joi.string().valid("Completed", "Ongoing", "Planned").required(),
    industry: Joi.string().max(255).allow(null, "").optional(),
  })
    .custom((value, helpers) => {
      // Custom validation for date logic
      if (value.startDate && value.endDate && value.endDate < value.startDate) {
        return helpers.error("date.endBeforeStart");
      }
      if (value.status === "Completed" && !value.endDate) {
        return helpers.error("project.completedWithoutEndDate");
      }
      return value;
    })
    .messages({
      "date.endBeforeStart": "End date must be after start date",
      "project.completedWithoutEndDate":
        "Completed projects should have an end date",
    }),

  updateProject: Joi.object({
    name: Joi.string().max(255).optional(),
    link: Joi.string().uri().max(500).allow(null, "").optional(),
    description: Joi.string().max(500).allow(null, "").optional(),
    startDate: Joi.date().optional(),
    endDate: Joi.date().allow(null).optional(),
    technologies: Joi.string().max(500).allow(null, "").optional(),
    collaborators: Joi.string().max(255).allow(null, "").optional(),
    status: Joi.string().valid("Completed", "Ongoing", "Planned").optional(),
    industry: Joi.string().max(255).allow(null, "").optional(),
  })
    .custom((value, helpers) => {
      // Custom validation for date logic
      if (value.startDate && value.endDate && value.endDate < value.startDate) {
        return helpers.error("date.endBeforeStart");
      }
      return value;
    })
    .messages({
      "date.endBeforeStart": "End date must be after start date",
    }),

  projectId: Joi.object({
    id: Joi.string().uuid().required(),
  }),

  createProfile: Joi.object({
    firstName: Joi.string().max(255).required(),
    middleName: Joi.string().max(255).allow(null, "").optional(),
    lastName: Joi.string().max(255).required(),
    phone: Joi.string().max(15).allow(null, "").optional(),
    city: Joi.string().max(255).allow(null, "").optional(),
    state: Joi.string().length(2).uppercase().required(),
    jobTitle: Joi.string().max(255).allow(null, "").optional(),
    bio: Joi.string().max(500).allow(null, "").optional(),
    industry: Joi.string().max(255).allow(null, "").optional(),
    expLevel: Joi.string()
      .valid("Entry", "Mid", "Senior")
      .allow(null, "")
      .optional(),
  }),

  updateProfile: Joi.object({
    firstName: Joi.string().max(255).optional(),
    middleName: Joi.string().max(255).allow(null, "").optional(),
    lastName: Joi.string().max(255).optional(),
    phone: Joi.string().max(15).allow(null, "").optional(),
    city: Joi.string().max(255).allow(null, "").optional(),
    state: Joi.string().length(2).uppercase().optional(),
    jobTitle: Joi.string().max(255).allow(null, "").optional(),
    bio: Joi.string().max(500).allow(null, "").optional(),
    industry: Joi.string().max(255).allow(null, "").optional(),
    expLevel: Joi.string()
      .valid("Entry", "Mid", "Senior")
      .allow(null, "")
      .optional(),
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
export const validateDeleteAccount = validate(schemas.deleteAccount);
export const validateCreateEducation = validate(schemas.createEducation);
export const validateUpdateEducation = validate(schemas.updateEducation);
export const validateCreateSkill = validate(schemas.createSkill);
export const validateUpdateSkill = validate(schemas.updateSkill);
export const validateCreateJob = validate(schemas.createJob);
export const validateUpdateJob = validate(schemas.updateJob);
export const validateJobId = validateParams(schemas.jobId);
export const validateCreateCertification = validate(
  schemas.createCertification
);
export const validateUpdateCertification = validate(
  schemas.updateCertification
);
export const validateCertificationId = validateParams(schemas.certificationId);
export const validateFileId = validateParams(schemas.fileId);
export const validateCreateProject = validate(schemas.createProject);
export const validateUpdateProject = validate(schemas.updateProject);
export const validateProjectId = validateParams(schemas.projectId);
export const validateCreateProfile = validate(schemas.createProfile);
export const validateUpdateProfile = validate(schemas.updateProfile);
