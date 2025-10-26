import certificationService from "../services/certificationService.js";
import { asyncHandler } from "../middleware/errorHandler.js";

class CertificationController {
  // Create a new certification
  create = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const certificationData = req.body;

    const certification = await certificationService.createCertification(userId, certificationData);

    res.status(201).json({
      ok: true,
      data: {
        certification,
        message: "Certification created successfully",
      },
    });
  });

  // Get all certifications for the current user
  getAll = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    const certifications = await certificationService.getCertifications(userId);

    res.status(200).json({
      ok: true,
      data: {
        certifications,
        count: certifications.length,
      },
    });
  });

  // Get a specific certification by ID
  getById = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;

    try {
      const certification = await certificationService.getCertificationById(id, userId);

      res.status(200).json({
        ok: true,
        data: {
          certification,
        },
      });
    } catch (error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({
          ok: false,
          error: {
            code: "CERTIFICATION_NOT_FOUND",
            message: "Certification not found",
          },
        });
      }
      throw error;
    }
  });

  // Update a certification
  update = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;
    const updateData = req.body;

    const certification = await certificationService.updateCertification(id, userId, updateData);

    res.status(200).json({
      ok: true,
      data: {
        certification,
        message: "Certification updated successfully",
      },
    });
  });

  // Delete a certification
  delete = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { id } = req.params;

    await certificationService.deleteCertification(id, userId);

    res.status(200).json({
      ok: true,
      data: {
        message: "Certification deleted successfully",
      },
    });
  });

  // Get certifications by organization
  getByOrganization = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { organization } = req.query;

    if (!organization) {
      return res.status(400).json({
        ok: false,
        error: {
          code: "MISSING_ORGANIZATION",
          message: "Organization name is required",
        },
      });
    }

    const certifications = await certificationService.getCertificationsByOrganization(userId, organization);

    res.status(200).json({
      ok: true,
      data: {
        certifications,
        count: certifications.length,
        organization,
      },
    });
  });

  // Get expiring certifications
  getExpiring = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { days = 30 } = req.query;

    const certifications = await certificationService.getExpiringCertifications(userId, parseInt(days));

    res.status(200).json({
      ok: true,
      data: {
        certifications,
        count: certifications.length,
        daysAhead: parseInt(days),
      },
    });
  });

  // Get certification statistics
  getStatistics = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    const statistics = await certificationService.getCertificationStatistics(userId);

    res.status(200).json({
      ok: true,
      data: {
        statistics,
      },
    });
  });

  // Search certifications
  search = asyncHandler(async (req, res) => {
    const userId = req.session.userId;
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        ok: false,
        error: {
          code: "MISSING_SEARCH_TERM",
          message: "Search term is required",
        },
      });
    }

    const certifications = await certificationService.searchCertifications(userId, q);

    res.status(200).json({
      ok: true,
      data: {
        certifications,
        count: certifications.length,
        searchTerm: q,
      },
    });
  });

  // Get current certifications (non-expired)
  getCurrent = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    const allCertifications = await certificationService.getCertifications(userId);
    
    // Filter for current (non-expired) certifications
    const currentCertifications = allCertifications.filter(cert => 
      cert.status === 'active' || cert.status === 'permanent' || cert.status === 'no_expiration'
    );

    res.status(200).json({
      ok: true,
      data: {
        certifications: currentCertifications,
        count: currentCertifications.length,
      },
    });
  });

  // Get certification history (all certifications including expired)
  getHistory = asyncHandler(async (req, res) => {
    const userId = req.session.userId;

    const certifications = await certificationService.getCertifications(userId);

    res.status(200).json({
      ok: true,
      data: {
        certifications,
        count: certifications.length,
      },
    });
  });
}

export default new CertificationController();
