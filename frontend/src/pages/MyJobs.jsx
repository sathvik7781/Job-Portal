import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  TrendingUp,
  FileText,
  Search,
  Filter,
  BarChart3,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Package
} from 'lucide-react';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    draft: 0,
    closed: 0,
    totalApplications: 0,
    avgApplications: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, filterStatus, searchTerm]);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      const response = await jobAPI.getMyJobs();
      const jobsData = response.data.data;
      setJobs(jobsData);
      
      // Calculate stats
      const totalApps = jobsData.reduce((sum, job) => sum + (job.applicationCount || job.applications?.length || 0), 0);
      const newStats = {
        total: jobsData.length,
        active: jobsData.filter(j => j.status === 'active').length,
        draft: jobsData.filter(j => j.status === 'draft').length,
        closed: jobsData.filter(j => j.status === 'closed').length,
        totalApplications: totalApps,
        avgApplications: jobsData.length > 0 ? Math.round(totalApps / jobsData.length) : 0
      };
      setStats(newStats);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(job => job.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  };

  const handleDelete = async (jobId, jobTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${jobTitle}"? This will also delete all applications.`)) {
      return;
    }

    try {
      await jobAPI.deleteJob(jobId);
      toast.success('Job deleted successfully');
      fetchMyJobs();
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const handleStatusChange = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'closed' : 'active';
    const confirmMessage = newStatus === 'closed' 
      ? 'Are you sure you want to close this job? It will no longer accept applications.'
      : 'Are you sure you want to reopen this job?';

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await jobAPI.updateJob(jobId, { status: newStatus });
      toast.success(`Job ${newStatus === 'active' ? 'reopened' : 'closed'} successfully`);
      fetchMyJobs();
    } catch (error) {
      toast.error('Failed to update job status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      draft: 'bg-gray-100 text-gray-800 border-gray-200',
      closed: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: <CheckCircle className="h-4 w-4" />,
      draft: <Edit className="h-4 w-4" />,
      closed: <XCircle className="h-4 w-4" />,
    };
    return icons[status] || <FileText className="h-4 w-4" />;
  };

  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Not specified';
    const formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
    return `${currency || 'USD'} ${formatter.format(min)} - ${formatter.format(max)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-200">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Jobs</h1>
            <p className="text-gray-600">Manage your job postings and applications</p>
          </div>
          <Link to="/post-job" className="btn-primary flex items-center gap-2 shadow-lg">
            <Plus className="h-5 w-5" />
            Post New Job
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <StatCard
            icon={Briefcase}
            label="Total Jobs"
            value={stats.total}
            color="bg-primary-600"
          />
          <StatCard
            icon={CheckCircle}
            label="Active"
            value={stats.active}
            color="bg-green-600"
          />
          <StatCard
            icon={Edit}
            label="Drafts"
            value={stats.draft}
            color="bg-gray-600"
          />
          <StatCard
            icon={XCircle}
            label="Closed"
            value={stats.closed}
            color="bg-red-600"
          />
          <StatCard
            icon={Users}
            label="Total Applications"
            value={stats.totalApplications}
            color="bg-blue-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Avg per Job"
            value={stats.avgApplications}
            color="bg-purple-600"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by job title, company, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 w-full"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="input-field pl-10 w-full"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || filterStatus !== 'all'
                  ? 'No jobs found'
                  : 'No jobs posted yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first job posting to start hiring'}
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Link to="/post-job" className="btn-primary inline-flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Post Your First Job
                </Link>
              )}
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-2 border-transparent hover:border-primary-200"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Section - Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold text-gray-900">
                            {job.title}
                          </h2>
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border-2 ${getStatusColor(job.status)}`}>
                            {getStatusIcon(job.status)}
                            <span className="capitalize">{job.status}</span>
                          </div>
                        </div>
                        <p className="text-lg text-gray-700 font-medium mb-3">{job.company}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-2 text-gray-400" />
                            {job.jobType} • {job.experienceLevel}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                            {formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency)}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            Posted {formatDate(job.createdAt)}
                          </span>
                        </div>

                        {/* Application Deadline Warning */}
                        {job.deadline && (
                          <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${
                            isDeadlinePassed(job.deadline)
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                          }`}>
                            {isDeadlinePassed(job.deadline) ? (
                              <>
                                <AlertCircle className="h-4 w-4" />
                                <span>Deadline passed: {formatDate(job.deadline)}</span>
                              </>
                            ) : (
                              <>
                                <Clock className="h-4 w-4" />
                                <span>Deadline: {formatDate(job.deadline)}</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Applications Count */}
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary-600" />
                        <span className="text-2xl font-bold text-gray-900">
                          {job.applicationCount || job.applications?.length || 0}
                        </span>
                        <span className="text-sm text-gray-600">
                          {(job.applicationCount || job.applications?.length || 0) === 1 ? 'Application' : 'Applications'}
                        </span>
                      </div>
                      <div className="h-6 w-px bg-gray-300"></div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Eye className="h-4 w-4" />
                        <span>{job.openings} {job.openings === 1 ? 'Opening' : 'Openings'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="flex flex-col gap-3 lg:w-48">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="btn-outline w-full flex items-center justify-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Job
                    </Link>

                    <Link
                      to={`/edit-job/${job._id}`}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Link>

                    <Link
                      to={`/job/${job._id}/applications`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      <BarChart3 className="h-4 w-4" />
                      Applications
                    </Link>

                    {job.status !== 'draft' && (
                      <button
                        onClick={() => handleStatusChange(job._id, job.status)}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                          job.status === 'active'
                            ? 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
                            : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                        }`}
                      >
                        {job.status === 'active' ? (
                          <>
                            <XCircle className="h-4 w-4" />
                            Close Job
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Reopen
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(job._id, job.title)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Results Summary */}
        {filteredJobs.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
