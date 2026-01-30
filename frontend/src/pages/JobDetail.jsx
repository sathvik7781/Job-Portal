import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jobAPI, applicationAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Calendar,
  Building2,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Share2,
  Bookmark,
  Flag
} from 'lucide-react';

const JobDetail = () => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  
  const { id } = useParams();
  const { isAuthenticated, isSeeker, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobDetails();
    if (isAuthenticated && isSeeker) {
      checkApplicationStatus();
    }
  }, [id, isAuthenticated, isSeeker]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getJobById(id);
      setJob(response.data.data);
    } catch (error) {
      toast.error('Failed to load job details');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const response = await applicationAPI.getMyApplications();
      const applications = response.data.data;
      const applied = applications.some(app => app.job?._id === id);
      setHasApplied(applied);
    } catch (error) {
      console.error('Failed to check application status:', error);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }

    if (!isSeeker) {
      toast.error('Only job seekers can apply for jobs');
      return;
    }

    try {
      setApplying(true);
      await applicationAPI.applyForJob({
        jobId: id,
        coverLetter: coverLetter.trim()
      });
      
      toast.success('Application submitted successfully!');
      setHasApplied(true);
      setShowApplyForm(false);
      setCoverLetter('');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit application';
      toast.error(message);
    } finally {
      setApplying(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Job link copied to clipboard!');
  };

  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Salary not specified';
    const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
    return `${currency || 'USD'} ${formatter.format(min)} - ${formatter.format(max)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Posted today';
    if (diffInDays === 1) return 'Posted yesterday';
    if (diffInDays < 7) return `Posted ${diffInDays} days ago`;
    if (diffInDays < 30) return `Posted ${Math.floor(diffInDays / 7)} weeks ago`;
    return `Posted ${Math.floor(diffInDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Link to="/jobs" className="btn-primary">
            Browse Other Jobs
          </Link>
        </div>
      </div>
    );
  }

  const canApply = isAuthenticated && isSeeker && job.status === 'active' && !hasApplied && !isDeadlinePassed(job.deadline);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-start gap-6 mb-6">
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                  {job.company?.charAt(0) || 'J'}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                      <p className="text-xl text-gray-700 font-medium">{job.company}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={handleShare}
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Share job"
                      >
                        <Share2 className="h-5 w-5" />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Save job"
                      >
                        <Bookmark className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {job.jobType}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {job.experienceLevel}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {getTimeAgo(job.createdAt)}
                    </span>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2">
                    {job.status === 'active' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200">
                        <CheckCircle className="h-4 w-4" />
                        Active
                      </span>
                    )}
                    {job.status === 'closed' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium border border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        Closed
                      </span>
                    )}
                    {hasApplied && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200">
                        <CheckCircle className="h-4 w-4" />
                        Applied
                      </span>
                    )}
                    {job.deadline && (
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${
                        isDeadlinePassed(job.deadline)
                          ? 'bg-red-100 text-red-800 border-red-200'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}>
                        <Calendar className="h-4 w-4" />
                        {isDeadlinePassed(job.deadline) ? 'Deadline Passed' : `Deadline: ${formatDate(job.deadline)}`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {job.requirements}
              </div>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsibilities</h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                  {job.responsibilities}
                </div>
              </div>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-primary-100 text-primary-800 rounded-lg text-sm font-medium border border-primary-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
                <div className="flex flex-wrap gap-2">
                  {job.benefits.map((benefit, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium border border-green-200"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 sticky top-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 text-2xl font-bold text-gray-900 mb-2">
                  <DollarSign className="h-6 w-6 text-primary-600" />
                  {formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency)}
                </div>
                <p className="text-sm text-gray-600">Per year</p>
              </div>

              {canApply ? (
                !showApplyForm ? (
                  <button
                    onClick={() => setShowApplyForm(true)}
                    className="w-full btn-primary py-3 text-lg"
                  >
                    Apply Now
                  </button>
                ) : (
                  <form onSubmit={handleApply} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Letter
                      </label>
                      <textarea
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        rows={6}
                        className="input-field resize-none text-sm"
                        placeholder="Tell us why you're a great fit for this role..."
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowApplyForm(false)}
                        className="flex-1 btn-secondary py-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={applying}
                        className="flex-1 btn-primary py-2"
                      >
                        {applying ? 'Submitting...' : 'Submit'}
                      </button>
                    </div>
                  </form>
                )
              ) : (
                <div>
                  {!isAuthenticated ? (
                    <Link to="/login" className="w-full btn-primary py-3 text-lg block text-center">
                      Login to Apply
                    </Link>
                  ) : hasApplied ? (
                    <div className="text-center py-4">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                      <p className="text-green-800 font-medium">Already Applied</p>
                      <Link to="/my-applications" className="text-sm text-primary-600 hover:underline mt-2 inline-block">
                        View Application
                      </Link>
                    </div>
                  ) : job.status !== 'active' ? (
                    <div className="text-center py-4 text-gray-600">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="font-medium">This job is no longer accepting applications</p>
                    </div>
                  ) : isDeadlinePassed(job.deadline) ? (
                    <div className="text-center py-4 text-red-600">
                      <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-2" />
                      <p className="font-medium">Application deadline has passed</p>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-600">
                      <p className="font-medium">Only job seekers can apply</p>
                    </div>
                  )}
                </div>
              )}

              {job.applicationUrl && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-outline py-2 flex items-center justify-center gap-2"
                  >
                    Apply on Company Site
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Job Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Job Information</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-600 mb-1">Company</p>
                    <p className="font-medium text-gray-900">{job.company}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-600 mb-1">Location</p>
                    <p className="font-medium text-gray-900">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-600 mb-1">Job Type</p>
                    <p className="font-medium text-gray-900 capitalize">{job.jobType}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-600 mb-1">Experience Level</p>
                    <p className="font-medium text-gray-900 capitalize">{job.experienceLevel}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-gray-600 mb-1">Posted</p>
                    <p className="font-medium text-gray-900">{formatDate(job.createdAt)}</p>
                  </div>
                </div>
                {job.openings && (
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-600 mb-1">Openings</p>
                      <p className="font-medium text-gray-900">{job.openings}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Report Button */}
            <button className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-red-600 py-2 text-sm transition-colors">
              <Flag className="h-4 w-4" />
              Report this job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
