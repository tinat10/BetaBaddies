import { useState, useEffect } from "react";
import { api } from "../services/api";
import { EducationData, EducationInput, EDUCATION_LEVELS } from "../types";

interface EducationFormData {
  id?: string;
  institutionName: string;
  fieldOfStudy: string;
  educationLevel: string;
  graduationDate: string;
  gpa: string;
  currentlyEnrolled: boolean;
  achievements: string;
}

export function Education() {
  const [educationList, setEducationList] = useState<EducationData[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  
  const [formData, setFormData] = useState<EducationFormData>({
    institutionName: "",
    fieldOfStudy: "",
    educationLevel: "",
    graduationDate: "",
    gpa: "",
    currentlyEnrolled: false,
    achievements: "",
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const response = await api.getEducation();
      // Backend returns { ok: true, data: { educations: [...] } }
      if (response.data?.educations) {
        setEducationList(response.data.educations);
      }
    } catch (error: any) {
      showMessage(error.message || "Failed to load education", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const resetForm = () => {
    setFormData({
      institutionName: "",
      fieldOfStudy: "",
      educationLevel: "",
      graduationDate: "",
      gpa: "",
      currentlyEnrolled: false,
      achievements: "",
    });
    setIsFormOpen(false);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.institutionName.trim()) {
      showMessage("Institution name is required", "error");
      return;
    }
    if (!formData.educationLevel) {
      showMessage("Education level is required", "error");
      return;
    }
    if (!formData.fieldOfStudy.trim()) {
      showMessage("Field of study is required", "error");
      return;
    }
    if (!formData.currentlyEnrolled && !formData.graduationDate) {
      showMessage("Graduation date is required unless currently enrolled", "error");
      return;
    }

    // Validate GPA if provided
    if (formData.gpa) {
      const gpaValue = parseFloat(formData.gpa);
      if (isNaN(gpaValue) || gpaValue < 0 || gpaValue > 4.0) {
        showMessage("GPA must be a number between 0 and 4.0", "error");
        return;
      }
    }

    try {
      // Transform frontend data to match backend expectations
      const backendPayload: EducationInput = {
        school: formData.institutionName.trim(),
        degreeType: formData.educationLevel, // degree_type in backend = educationLevel in frontend
        field: formData.fieldOfStudy.trim() || undefined,
        // graduationDate: not sent to backend yet (DB doesn't have this field)
        gpa: formData.gpa ? parseFloat(formData.gpa) : undefined,
        isEnrolled: formData.currentlyEnrolled,
        honors: formData.achievements.trim() || undefined,
      };

      if (isEditing && formData.id) {
        await api.updateEducation(formData.id, backendPayload);
        showMessage("Education updated successfully", "success");
      } else {
        await api.createEducation(backendPayload);
        showMessage("Education added successfully", "success");
      }

      resetForm();
      fetchEducation();
    } catch (error: any) {
      showMessage(error.message || "Failed to save education", "error");
    }
  };

  const handleEdit = (education: EducationData) => {
    // Transform backend data to match frontend form structure
    setFormData({
      id: education.id,
      institutionName: education.school || "",
      fieldOfStudy: education.field || "",
      educationLevel: education.degreeType || "", // degree_type from backend = educationLevel in frontend
      graduationDate: "", // Not in backend yet
      gpa: education.gpa?.toString() || "",
      currentlyEnrolled: education.isEnrolled || false,
      achievements: education.honors || "",
    });
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this education entry?")) {
      return;
    }

    try {
      await api.deleteEducation(id);
      showMessage("Education deleted successfully", "success");
      fetchEducation();
    } catch (error: any) {
      showMessage(error.message || "Failed to delete education", "error");
    }
  };


  return (
    <div className="p-10 max-w-[1400px] mx-auto bg-white font-sans min-h-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Education</h1>
        <p className="text-gray-600">Manage your educational background and qualifications</p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message.text}
        </div>
      )}

      {/* Add New Button */}
      {!isFormOpen && (
        <button
          onClick={() => setIsFormOpen(true)}
          className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Add Education
        </button>
      )}

      {/* Education Form */}
      {isFormOpen && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6">
            {isEditing ? "Edit Education" : "Add Educational Background"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Institution Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution Name *
              </label>
              <input
                type="text"
                name="institutionName"
                value={formData.institutionName}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="e.g., Harvard University"
                required
              />
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Education Level *
              </label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                required
              >
                <option value="">Select Education Level</option>
                {EDUCATION_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

            {/* Field of Study */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field of Study *
              </label>
              <input
                type="text"
                name="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="e.g., Computer Science"
                required
              />
            </div>

            {/* Currently Enrolled Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="currentlyEnrolled"
                checked={formData.currentlyEnrolled}
                onChange={handleChange}
                id="currentlyEnrolled"
              />
              <label htmlFor="currentlyEnrolled" className="text-sm font-medium text-gray-700 cursor-pointer">
                Currently enrolled
              </label>
            </div>

            {/* Graduation Date - only show if not currently enrolled */}
            {!formData.currentlyEnrolled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Graduation Date *
                </label>
                <input
                  type="month"
                  name="graduationDate"
                  value={formData.graduationDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                  required={!formData.currentlyEnrolled}
                />
              </div>
            )}

            {/* GPA Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GPA (Optional)
              </label>
              <input
                type="number"
                name="gpa"
                value={formData.gpa}
                onChange={handleChange}
                step="0.01"
                min="0"
                max="4.0"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="e.g., 3.75"
              />
              <p className="text-xs text-gray-500 mt-1">Enter on a 4.0 scale</p>
            </div>

            {/* Achievements/Honors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Achievements/Honors (Optional)
              </label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                placeholder="e.g., Dean's List, Cum Laude, Academic Scholarships, Awards..."
              />
            </div>

            {/* Form Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
              >
                {isEditing ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Education List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading education...</p>
          </div>
        ) : educationList.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">No education entries yet. Click "Add Education" to get started.</p>
          </div>
        ) : (
          educationList.map((education) => (
            <div
              key={education.id}
              className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {education.school}
                  </h3>
                  <p className="text-lg text-gray-700 mt-1">
                    {education.degreeType}{education.field ? ` in ${education.field}` : ''}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {education.isEnrolled ? (
                      <span className="text-blue-600 font-medium">Currently Enrolled</span>
                    ) : (
                      <span>Completed</span>
                    )}
                  </p>
                  {education.gpa && (
                    <p className="text-sm text-gray-600 mt-1">
                      GPA: {education.gpa.toFixed(2)}
                    </p>
                  )}
                  {education.honors && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">Achievements & Honors:</p>
                      <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                        {education.honors}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(education)}
                    className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(education.id)}
                    className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
