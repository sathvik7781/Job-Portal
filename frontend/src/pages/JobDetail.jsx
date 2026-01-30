import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobAPI, applicationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Clock,
  Users,
  Building2,
  GraduationCap,
  ArrowLeft,
  Send,
  Heart,
  Share2,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  TrendingUp,
  Target,
  Sparkles,
  Award,
  Zap
} from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isSeeker, user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    checkApplicationStatus();
  }, [id]);

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
    if (!isAuthenticated || !isSeeker) return;
    
    try {
      const response = await applicationAPI.getMyApplications();
      const applied = response.data.data.some(app => app.job?._id === id);
      setHasApplied(applied);
    } catch (error) {
      // Silently fail
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
      toast.error('Only job seekers can apply');
      return;
    }

    if (hasApplied) {
      toast.error('You have already applied to this job');
      return;
    }

    try {
      setApplying(true);
      await applicationAPI.applyForJob({
        job: id,
        coverLetter: coverLetter.trim() || undefined
      });
      
      toast.success('Application submitted successfully!');
      setHasApplied(true);
      setShowApplicationForm(false);
      setCoverLetter('');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit application';
      toast.error(message);
    } finally {
      setApplying(false);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from saved jobs' : 'Job saved successfully');
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href
      });
    } catch (error) {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Competitive';
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

  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h2>
          <Link to="/jobs" className="btn-primary">Back to Jobs</Link>
        </div>
      </div>
    );
  }

  const daysUntilDeadline = getDaysUntilDeadline(job.deadline);
  const isUrgent = daysUntilDeadline !== null && daysUntilDeadline <= 7 && daysUntilDeadline > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/jobs')}
          className="group flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Jobs</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-transparent hover:border-primary-200 transition-all">
              {/* Company Badge */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                  {job.company.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{job.title}</h1>
                  <div className="flex items-center gap-2 text-lg text-gray-700">
                    <Building2 className="h-5 w-5" />
                    <span className="font-semibold">{job.company}</span>
                  </div>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold border-2 border-green-200">
                  <CheckCircle className="h-4 w-4" />
                  {job.status === 'active' ? 'Actively Hiring' : job.status}
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold border-2 border-blue-200">
                  <Briefcase className="h-4 w-4" />
                  {job.jobType}
                </span>
                {isUrgent && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold border-2 border-red-200 animate-pulse">
                    <Zap className="h-4 w-4" />
                    {daysUntilDeadline} days left
                  </span>
                )}
              </div>

              {/* Key Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Location</p>
                    <p className="text-sm font-bold text-gray-900">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Salary Range</p>
                    <p className="text-sm font-bold text-gray-900">
                      {formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Experience</p>
                    <p className="text-sm font-bold text-gray-900">{job.experienceLevel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow">
                    <Users className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Openings</p>
                    <p className="text-sm font-bold text-gray-900">{job.openings} position{job.openings !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    isSaved
                      ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Saved' : 'Save Job'}
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary-600" />
                Job Description
              </h2>
              <div className="prose max-w-none text-gray-700 leading-relaxed">
                {job.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary-600" />
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills Required */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-6 w-6 text-primary-600" />
                  Skills Required
                </h2>
                <div className="flex flex-wrap gap-3">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 rounded-lg font-medium border-2 border-blue-100 hover:border-blue-300 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary-600" />
                  Benefits & Perks
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {job.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Application Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Ready to Apply Card */}
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 text-white overflow-hidden relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-6 w-6 text-yellow-300" />
                    <span className="text-sm font-semibold text-white/90">Ready to Apply?</span>
                  </div>

                  <h3 className="text-2xl font-extrabold mb-4">
                    {hasApplied ? "You've Applied!" : 'Take the Next Step'}
                  </h3>

                  {hasApplied ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                        <CheckCircle className="h-6 w-6 text-green-300" />
                        <span className="text-sm font-medium">Application submitted successfully</span>
                      </div>
                      <Link
                        to="/my-applications"
                        className="block w-full px-6 py-3 bg-white text-purple-600 rounded-xl font-bold text-center hover:bg-gray-100 transition-colors"
                      >
                        View My Applications
                      </Link>
                    </div>
                  ) : job.status === 'active' && !isDeadlinePassed(job.deadline) ? (
                    <>
                      {!showApplicationForm ? (
                        <button
                          onClick={() => setShowApplicationForm(true)}
                          className="w-full px-6 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          Apply Now
                          <Send className="h-5 w-5" />
                        </button>
                      ) : (
                        <form onSubmit={handleApply} className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold mb-2 text-white/90">
                              Cover Letter (Optional)
                            </label>
                            <textarea
                              value={coverLetter}
                              onChange={(e) => setCoverLetter(e.target.value)}
                              placeholder="Tell us why you're perfect for this role..."
                              rows="6"
                              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all resize-none"
                            />
                            <p className="text-xs text-white/70 mt-2">
                              {coverLetter.length} characters
                            </p>
                          </div>

                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => setShowApplicationForm(false)}
                              className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all border-2 border-white/20"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={applying}
                              className="flex-1 px-4 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                              {applying ? (
                                <span className="flex items-center justify-center gap-2">
                                  <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                                  Submitting...
                                </span>
                              ) : (
                                <span className="flex items-center justify-center gap-2">
                                  Submit
                                  <Send className="h-4 w-4" />
                                </span>
                              )}
                            </button>
                          </div>
                        </form>
                      )}

                      {!showApplicationForm && (
                        <div className="mt-6 space-y-3 text-sm text-white/80">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>Quick application process</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>Hear back within 48 hours</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>Direct employer contact</span>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-white/20 backdrop-blur-sm rounded-xl">
                      <XCircle className="h-6 w-6 text-red-300" />
                      <span className="text-sm font-medium">
                        {isDeadlinePassed(job.deadline) ? 'Application deadline has passed' : 'This job is no longer accepting applications'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Info Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Job Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Posted
                    </span>
                    <span className="text-sm font-semibold text-gray-900">{formatDate(job.createdAt)}</span>
                  </div>

                  {job.deadline && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Deadline
                      </span>
                      <span className={`text-sm font-semibold ${isDeadlinePassed(job.deadline) ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-gray-900'}`}>
                        {formatDate(job.deadline)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Applicants
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {job.applicationCount || 0} {job.applicationCount === 1 ? 'applicant' : 'applicants'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-600 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Job ID
                    </span>
                    <span className="text-sm font-mono font-semibold text-gray-900">#{job._id.slice(-8)}</span>
                  </div>
                </div>
              </div>

              {/* Similar Jobs Teaser */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-lg p-6 border-2 border-blue-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Looking for more?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Explore similar opportunities that match your profile
                </p>
                <Link
                  to="/jobs"
                  className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-center hover:shadow-lg transition-all"
                >
                  Browse All Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
