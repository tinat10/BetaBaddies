import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { api } from '../services/api';
import { Skill, SkillInput, PROFICIENCY_LEVELS, SKILL_CATEGORIES } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SkillInput>({
    skillName: '',
    proficiency: 'Beginner',
    category: null,
    skillBadge: null,
  });

  // Load skills on component mount
  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getSkills();
      if (response.data?.skills) {
        setSkills(response.data.skills);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SkillInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value || null,
    }));
  };

  const resetForm = () => {
    setFormData({
      skillName: '',
      proficiency: 'Beginner',
      category: null,
      skillBadge: null,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAddSkill = async () => {
    if (!formData.skillName.trim()) {
      setError('Skill name is required');
      return;
    }

    try {
      setError(null);
      const response = await api.createSkill(formData);
      if (response.data?.skill) {
        setSkills(prev => [...prev, response.data!.skill]);
        setMessage('Skill added successfully');
        resetForm();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add skill');
    }
  };

  const handleUpdateSkill = async (skillId: string) => {
    try {
      setError(null);
      const response = await api.updateSkill(skillId, formData);
      if (response.data?.skill) {
        setSkills(prev => 
          prev.map(skill => 
            skill.id === skillId ? response.data!.skill : skill
          )
        );
        setMessage('Skill updated successfully');
        resetForm();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update skill');
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    try {
      setError(null);
      await api.deleteSkill(skillId);
      setSkills(prev => prev.filter(skill => skill.id !== skillId));
      setMessage('Skill deleted successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete skill');
    }
  };

  const startEditing = (skill: Skill) => {
    setFormData({
      skillName: skill.skillName,
      proficiency: skill.proficiency,
      category: skill.category,
      skillBadge: skill.skillBadge,
    });
    setEditingId(skill.id);
    setIsAdding(false);
  };

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'Technical': return 'bg-blue-100 text-blue-800';
      case 'Soft Skills': return 'bg-purple-100 text-purple-800';
      case 'Languages': return 'bg-pink-100 text-pink-800';
      case 'Industry-Specific': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-10 max-w-[1400px] mx-auto bg-white font-sans min-h-full">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading skills...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-[1400px] mx-auto bg-white font-sans min-h-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Skills</h1>
        <p className="text-lg text-gray-600">Manage your professional skills and expertise</p>
      </div>

      {/* Message Display */}
      {message && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
          <button 
            onClick={() => setMessage(null)}
            className="ml-2 text-green-600 hover:text-green-800"
          >
            <X className="h-4 w-4 inline" />
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-600 hover:text-red-800"
          >
            <X className="h-4 w-4 inline" />
          </button>
        </div>
      )}

      {/* Add Skill Button */}
      <div className="mb-6">
        <Button
          onClick={() => {
            resetForm();
            setIsAdding(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Skill
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Skill' : 'Add New Skill'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="skillName">Skill Name *</Label>
              <Input
                id="skillName"
                type="text"
                value={formData.skillName}
                onChange={(e) => handleInputChange('skillName', e.target.value)}
                placeholder="e.g., JavaScript, Project Management"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="proficiency">Proficiency Level *</Label>
              <Select
                id="proficiency"
                value={formData.proficiency}
                onChange={(e) => handleInputChange('proficiency', e.target.value)}
                className="mt-1"
              >
                {PROFICIENCY_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={formData.category || ''}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="mt-1"
              >
                <option value="">Select Category</option>
                {SKILL_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="skillBadge">Skill Badge URL</Label>
              <Input
                id="skillBadge"
                type="url"
                value={formData.skillBadge || ''}
                onChange={(e) => handleInputChange('skillBadge', e.target.value)}
                placeholder="https://example.com/badge.png"
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <Button
              variant="outline"
              onClick={resetForm}
            >
              Cancel
            </Button>
            <Button
              onClick={() => editingId ? handleUpdateSkill(editingId) : handleAddSkill()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {editingId ? 'Update Skill' : 'Add Skill'}
            </Button>
          </div>
        </div>
      )}

      {/* Skills List */}
      <div className="space-y-4">
        {skills.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No skills added yet</p>
            <p className="text-gray-400 mt-2">Click "Add New Skill" to get started</p>
          </div>
        ) : (
          skills.map((skill) => (
            <div key={skill.id} className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{skill.skillName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProficiencyColor(skill.proficiency)}`}>
                      {skill.proficiency}
                    </span>
                    {skill.category && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(skill.category)}`}>
                        {skill.category}
                      </span>
                    )}
                  </div>
                  {skill.skillBadge && (
                    <div className="mt-2">
                      <img 
                        src={skill.skillBadge} 
                        alt={`${skill.skillName} badge`}
                        className="h-8 w-auto"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditing(skill)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}



