const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    position: {
      type: String,
      required: [true, "Position title is required"],
      trim: true,
      maxlength: [100, "Position title cannot exceed 100 characters"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    companyWebsite: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "Please enter a valid website URL"],
    },
    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true, default: "US" },
      remote: { type: Boolean, default: false },
    },
    salary: {
      min: { type: Number, min: 0 },
      max: { type: Number, min: 0 },
      currency: { type: String, default: "USD" },
      period: {
        type: String,
        enum: ["hourly", "monthly", "yearly"],
        default: "yearly",
      },
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Temporary"],
      default: "Full-time",
    },
    status: {
      type: String,
      enum: [
        "pending",
        "reviewed",
        "interview",
        "offer",
        "rejected",
        "withdrawn",
      ],
      default: "pending",
    },
    source: {
      type: String,
      enum: [
        "company-website",
        "job-board",
        "recruiter",
        "referral",
        "networking",
        "other",
      ],
      default: "job-board",
    },
    jobDescription: {
      type: String,
      trim: true,
      maxlength: [2000, "Job description cannot exceed 2000 characters"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    nextFollowUp: {
      type: Date,
    },
    contacts: [
      {
        name: { type: String, trim: true },
        email: { type: String, trim: true },
        phone: { type: String, trim: true },
        title: { type: String, trim: true },
        notes: { type: String, trim: true },
      },
    ],
    documents: [
      {
        name: { type: String, required: true },
        type: { type: String, required: true },
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [50, "Tag cannot exceed 50 characters"],
      },
    ],
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
applicationSchema.index({ userId: 1, createdAt: -1 });
applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ userId: 1, company: 1 });
applicationSchema.index({ appliedDate: -1 });

// Virtual for full location string
applicationSchema.virtual("fullLocation").get(function () {
  const parts = [];
  if (this.location.city) parts.push(this.location.city);
  if (this.location.state) parts.push(this.location.state);
  if (this.location.country && this.location.country !== "US")
    parts.push(this.location.country);
  return parts.join(", ");
});

// Virtual for salary range string
applicationSchema.virtual("salaryRange").get(function () {
  if (!this.salary.min && !this.salary.max) return null;

  const currency = this.salary.currency || "USD";
  const period = this.salary.period || "yearly";
  const periodText =
    period === "yearly" ? "year" : period === "monthly" ? "month" : "hour";

  if (this.salary.min && this.salary.max) {
    return `$${this.salary.min.toLocaleString()} - $${this.salary.max.toLocaleString()} per ${periodText}`;
  } else if (this.salary.min) {
    return `$${this.salary.min.toLocaleString()}+ per ${periodText}`;
  } else if (this.salary.max) {
    return `Up to $${this.salary.max.toLocaleString()} per ${periodText}`;
  }

  return null;
});

// Instance method to update last activity
applicationSchema.methods.updateActivity = function () {
  this.lastActivity = new Date();
  return this.save();
};

// Instance method to get status display text
applicationSchema.methods.getStatusText = function () {
  const statusMap = {
    pending: "Pending Review",
    reviewed: "Under Review",
    interview: "Interview Scheduled",
    offer: "Offer Received",
    rejected: "Not Selected",
    withdrawn: "Withdrawn",
  };
  return statusMap[this.status] || "Unknown";
};

// Static method to get applications by user and status
applicationSchema.statics.findByUserAndStatus = function (userId, status) {
  const query = { userId, isArchived: false };
  if (status && status !== "all") {
    query.status = status;
  }
  return this.find(query).sort({ appliedDate: -1 });
};

// Static method to get application statistics for a user
applicationSchema.statics.getUserStats = async function (userId) {
  const stats = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId), isArchived: false } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {
    total: 0,
    pending: 0,
    reviewed: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    withdrawn: 0,
  };

  stats.forEach((stat) => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });

  return result;
};

module.exports = mongoose.model("Application", applicationSchema);
