import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { jobAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  FileText,
  Tag,
  Globe,
  Save,
  Eye,
  AlertCircle,
  X,
  Plus,
  Clock
} from 'lucide-react';

const PostJob = () => {
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [benefits, setBenefits] = useState([]);
  const [benefitInput, setBenefitInput] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      status: 'draft',
      jobType: 'full-time',
      experienceLevel: 'mid-level',
      openings: 1,
      salary: {
        currency: 'USD'
      }
    }
  });

  const jobStatus = watch('status');

  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleAddBenefit = () => {
    const trimmedBenefit = benefitInput.trim();
    if (trimmedBenefit && !benefits.includes(trimmedBenefit)) {
      setBenefits([...benefits, trimmedBenefit]);
      setBenefitInput('');
    }
  };

  const handleRemoveBenefit = (benefitToRemove) => {
    setBenefits(benefits.filter(benefit => benefit !== benefitToRemove));
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Prepare job data
      const jobData = {
        ...data,
        skills: skills,
        benefits: benefits,
        salary: {
          min: data.salaryMin ? parseFloat(data.salaryMin) : undefined,
          max: data.salaryMax ? parseFloat(data.salaryMax) : undefined,
          currency: data.salaryCurrency
        }
      };

      // Remove temporary salary fields
      delete jobData.salaryMin;
      delete jobData.salaryMax;
      delete jobData.salaryCurrency;

      const response = await jobAPI.createJob(jobData);
      
      const statusMessage = data.status === 'active' ? 'published' : 'saved as draft';
      toast.success(`Job ${statusMessage} successfully!`);
      
      navigate('/my-jobs');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create job';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const FormSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Icon className="h-5 w-5 text-primary-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );

  const InputField = ({ label, error, children, required = false }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error.message}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Post a New Job</h1>
          <p className="text-gray-600">Fill in the details to create your job posting</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <FormSection title="Basic Information" icon={Briefcase}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Job Title" error={errors.title} required>
                <input
                  type="text"
                  {...register('title', { 
                    required: 'Job title is required',
                    minLength: { value: 3, message: 'Title must be at least 3 characters' }
                  })}
                  className="input-field"
                  placeholder="e.g., Senior Full Stack Developer"
                />
              </InputField>

              <InputField label="Company Name" error={errors.company} required>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    {...register('company', { required: 'Company name is required' })}
                    className="input-field pl-10"
                    placeholder="Your company name"
                  />
                </div>
              </InputField>

              <InputField label="Location" error={errors.location} required>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    {...register('location', { required: 'Location is required' })}
                    className="input-field pl-10"
                    placeholder="e.g., New York, NY or Remote"
                  />
                </div>
              </InputField>

              <InputField label="Job Type" error={errors.jobType} required>
                <select
                  {...register('jobType', { required: 'Job type is required' })}
                  className="input-field"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote</option>
                </select>
              </InputField>

              <InputField label="Experience Level" error={errors.experienceLevel} required>
                <select
                  {...register('experienceLevel', { required: 'Experience level is required' })}
                  className="input-field"
                >
                  <option value="entry-level">Entry Level</option>
                  <option value="mid-level">Mid Level</option>
                  <option value="senior-level">Senior Level</option>
                  <option value="lead">Lead</option>
                  <option value="executive">Executive</option>
                </select>
              </InputField>

              <InputField label="Number of Openings" error={errors.openings} required>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    {...register('openings', { 
                      required: 'Number of openings is required',
                      min: { value: 1, message: 'At least 1 opening required' }
                    })}
                    className="input-field pl-10"
                    placeholder="1"
                  />
                </div>
              </InputField>
            </div>
          </FormSection>

          {/* Job Description */}
          <FormSection title="Job Details" icon={FileText}>
            <div className="space-y-6">
              <InputField label="Job Description" error={errors.description} required>
                <textarea
                  {...register('description', { 
                    required: 'Job description is required',
                    minLength: { value: 50, message: 'Description must be at least 50 characters' }
                  })}
                  rows={6}
                  className="input-field resize-none"
                  placeholder="Describe the role, day-to-day responsibilities, and what success looks like..."
                />
                <p className="mt-1 text-xs text-gray-500">Minimum 50 characters</p>
              </InputField>

              <InputField label="Requirements" error={errors.requirements} required>
                <textarea
                  {...register('requirements', { 
                    required: 'Requirements are required',
                    minLength: { value: 30, message: 'Requirements must be at least 30 characters' }
                  })}
                  rows={5}
                  className="input-field resize-none"
                  placeholder="List required qualifications, experience, and skills..."
                />
              </InputField>

              <InputField label="Responsibilities (Optional)" error={errors.responsibilities}>
                <textarea
                  {...register('responsibilities')}
                  rows={5}
                  className="input-field resize-none"
                  placeholder="List key responsibilities and duties..."
                />
              </InputField>
            </div>
          </FormSection>

          {/* Skills & Benefits */}
          <FormSection title="Skills & Benefits" icon={Tag}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    className="input-field flex-1"
                    placeholder="Type a skill and press Enter or click Add"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-primary-900"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Benefits (Optional)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
                    className="input-field flex-1"
                    placeholder="Type a benefit and press Enter or click Add"
                  />
                  <button
                    type="button"
                    onClick={handleAddBenefit}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
                {benefits.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {benefits.map((benefit, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                      >
                        {benefit}
                        <button
                          type="button"
                          onClick={() => handleRemoveBenefit(benefit)}
                          className="hover:text-green-900"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </FormSection>

          {/* Salary & Deadline */}
          <FormSection title="Compensation & Timeline" icon={DollarSign}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <InputField label="Currency" error={errors.salaryCurrency}>
                <select
                  {...register('salaryCurrency')}
                  className="input-field"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="CAD">CAD (C$)</option>
                  <option value="AUD">AUD (A$)</option>
                </select>
              </InputField>

              <InputField label="Minimum Salary" error={errors.salaryMin}>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    {...register('salaryMin', {
                      min: { value: 0, message: 'Salary must be positive' }
                    })}
                    className="input-field pl-10"
                    placeholder="50000"
                  />
                </div>
              </InputField>

              <InputField label="Maximum Salary" error={errors.salaryMax}>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    {...register('salaryMax', {
                      min: { value: 0, message: 'Salary must be positive' }
                    })}
                    className="input-field pl-10"
                    placeholder="80000"
                  />
                </div>
              </InputField>
            </div>

            <InputField label="Application Deadline (Optional)" error={errors.deadline}>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  {...register('deadline')}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field pl-10"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Leave empty for no deadline</p>
            </InputField>
          </FormSection>

          {/* Additional Information */}
          <FormSection title="Additional Information" icon={Globe}>
            <InputField label="Application URL (Optional)" error={errors.applicationUrl}>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="url"
                  {...register('applicationUrl', {
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: 'Please enter a valid URL'
                    }
                  })}
                  className="input-field pl-10"
                  placeholder="https://company.com/apply"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">External application link (optional)</p>
            </InputField>
          </FormSection>

          {/* Status & Actions */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Status
                </label>
                <select
                  {...register('status')}
                  className="input-field max-w-xs"
                >
                  <option value="draft">Save as Draft</option>
                  <option value="active">Publish Now</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {jobStatus === 'draft' 
                    ? 'Save as draft to review and publish later' 
                    : 'Publish immediately and start receiving applications'}
                </p>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => navigate('/my-jobs')}
                  className="btn-secondary flex-1 md:flex-initial"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 md:flex-initial flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {jobStatus === 'draft' ? <Save className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {jobStatus === 'draft' ? 'Save Draft' : 'Publish Job'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
