import jobService from "../services/jobService.js";
import { asyncHandler } from "../middleware/errorHandler.js";

class JobController {
  // Create a new job
  createJob = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const jobData = req.body;

    const job = await jobService.createJob(userId, jobData);

    res.status(201).json({
      ok: true,
      data: {
        job: {
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          startDate: job.startDate,
          endDate: job.endDate,
          isCurrent: job.isCurrent,
          description: job.description,
        },
        message: "Job created successfully",
      },
    });
  });

  // Get all jobs for the authenticated user
  getJobs = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { sort, limit, offset } = req.query;

    const options = { sort, limit, offset };
    const jobs = await jobService.getJobsByUserId(userId, options);
    const currentJob = await jobService.getCurrentJob(userId);
    const statistics = await jobService.getJobStatistics(userId);

    res.status(200).json({
      ok: true,
      data: {
        jobs: jobs.map((job) => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          startDate: job.startDate,
          endDate: job.endDate,
          isCurrent: job.isCurrent,
          description: job.description,
        })),
        pagination: {
          total: statistics.totalJobs,
          limit: parseInt(limit) || 50,
          offset: parseInt(offset) || 0,
          hasMore: (parseInt(offset) || 0) + jobs.length < statistics.totalJobs,
        },
        currentJob: currentJob
          ? {
              id: currentJob.id,
              title: currentJob.title,
              company: currentJob.company,
            }
          : null,
        statistics: {
          totalJobs: statistics.totalJobs,
          currentJobs: statistics.currentJobs,
          pastJobs: statistics.pastJobs,
        },
      },
    });
  });

  // Get current job
  getCurrentJob = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    const currentJob = await jobService.getCurrentJob(userId);

    if (!currentJob) {
      return res.status(200).json({
        ok: true,
        data: {
          job: null,
          message: "No current job found",
        },
      });
    }

    res.status(200).json({
      ok: true,
      data: {
        job: {
          id: currentJob.id,
          title: currentJob.title,
          company: currentJob.company,
          location: currentJob.location,
          salary: currentJob.salary,
          startDate: currentJob.startDate,
          endDate: currentJob.endDate,
          isCurrent: currentJob.isCurrent,
          description: currentJob.description,
        },
      },
    });
  });

  // Get job by ID
  getJob = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;

    const job = await jobService.getJobById(id, userId);

    if (!job) {
      return res.status(404).json({
        ok: false,
        error: {
          code: "JOB_NOT_FOUND",
          message: "Job not found or does not belong to user",
        },
      });
    }

    res.status(200).json({
      ok: true,
      data: {
        job: {
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          startDate: job.startDate,
          endDate: job.endDate,
          isCurrent: job.isCurrent,
          description: job.description,
        },
      },
    });
  });

  // Update job
  updateJob = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;
    const updateData = req.body;

    const job = await jobService.updateJob(id, userId, updateData);

    res.status(200).json({
      ok: true,
      data: {
        job: {
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          startDate: job.startDate,
          endDate: job.endDate,
          isCurrent: job.isCurrent,
          description: job.description,
        },
        message: "Job updated successfully",
      },
    });
  });

  // Delete job
  deleteJob = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;

    const deletedJob = await jobService.deleteJob(id, userId);

    res.status(204).json({
      ok: true,
      data: {
        message: "Job deleted successfully",
        deletedJob: {
          id: deletedJob.id,
          title: deletedJob.title,
          company: deletedJob.company,
        },
      },
    });
  });

  // Get job history (timeline view)
  getJobHistory = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    const history = await jobService.getJobHistory(userId);

    res.status(200).json({
      ok: true,
      data: {
        history: history.map((job) => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          startDate: job.startDate,
          endDate: job.endDate,
          isCurrent: job.isCurrent,
          description: job.description,
        })),
        total: history.length,
      },
    });
  });

  // Get job statistics
  getJobStatistics = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    const statistics = await jobService.getJobStatistics(userId);

    res.status(200).json({
      ok: true,
      data: {
        statistics: {
          totalJobs: statistics.totalJobs,
          currentJobs: statistics.currentJobs,
          pastJobs: statistics.pastJobs,
          earliestStart: statistics.earliestStart,
          latestEnd: statistics.latestEnd,
          averageSalary: statistics.averageSalary,
          minSalary: statistics.minSalary,
          maxSalary: statistics.maxSalary,
          companiesWorked: statistics.companiesWorked,
          totalExperienceYears: statistics.totalExperienceYears,
          averageTenureMonths: statistics.averageTenureMonths,
        },
      },
    });
  });
}

export default new JobController();
