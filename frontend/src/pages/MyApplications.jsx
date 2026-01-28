import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationAPI } from '../services/api';
import toast from 'react-hot-toast';
import { 
  FileText, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Trash2,
  Filter,
  Search,
  TrendingUp,
  Package
} from 'lucide-react';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    reviewing: 0,
    shortlisted: 0,
    interview: 0,
    rejected: 0,
    hired: 0
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, filterStatus, searchTerm]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationAPI.getMyApplications();
      const apps = response.data.data;
      setApplications(apps);
      
      // Calculate stats
      const newStats = {
        total: apps.length,
        applied: apps.filter(a => a.status === 'applied').length,
        reviewing: apps.filter(a => a.status === 'reviewing').length,
        shortlisted: apps.filter(a => a.status === 'shortlisted').length,
        interview: apps.filter(a => a.status === 'interview').length,
        rejected: apps.filter(a => a.status === 'rejected').length,
        hired: apps.filter(a => a.status === 'hired').length,
      };
      setStats(newStats);
    } catch (error) {
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job?.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job?.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  };

  const handleWithdraw = async (applicationId, jobTitle) => {
    if (!window.confirm(`Are you sure you want to withdraw your application for "${jobTitle}"?`)) {
      return;
    }

    try {
      await applicationAPI.withdrawApplication(applicationId);
      toast.success('Application withdrawn successfully');
      fetchApplications();
    } catch (error) {
      toast.error('Failed to withdraw application');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-800 border-blue-200',
      reviewing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      shortlisted: 'bg-purple-100 text-purple-800 border-purple-200',
      interview: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      hired: 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      applied: <Clock className="h-4 w-4" />,
      reviewing: <Eye className="h-4 w-4" />,
      shortlisted: <TrendingUp className="h-4 w-4" />,
      interview: <AlertCircle className="h-4 w-4" />,
      rejected: <XCircle className="h-4 w-4" />,
      hired: <CheckCircle className="h-4 w-4" />,
    };
    return icons[status] || <FileText className="h-4 w-4" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track and manage your job applications</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <StatCard 
            icon={FileText} 
            label="Total" 
            value={stats.total} 
            color="bg-primary-600" 
          />
          <StatCard 
            icon={Clock} 
            label="Applied" 
            value={stats.applied} 
            color="bg-blue-600" 
          />
          <StatCard 
            icon={Eye} 
            label="Reviewing" 
            value={stats.reviewing} 
            color="bg-yellow-600" 
          />
          <StatCard 
            icon={TrendingUp} 
            label="Shortlisted" 
            value={stats.shortlisted} 
            color="bg-purple-600" 
          />
          <StatCard 
            icon={AlertCircle} 
            label="Interview" 
            value={stats.interview} 
            color="bg-indigo-600" 
          />
          <StatCard 
            icon={CheckCircle} 
            label="Hired" 
            value={stats.hired} 
            color="bg-green-600" 
          />
          <StatCard 
            icon={XCircle} 
            label="Rejected" 
            value={stats.rejected} 
            color="bg-red-600" 
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
                  <option value="applied">Applied</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interview">Interview</option>
                  <option value="hired">Hired</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No applications found' 
                  : 'No applications yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start applying to jobs to see them here'}
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Link to="/jobs" className="btn-primary inline-block">
                  Browse Jobs
                </Link>
              )}
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div
                key={application._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border-2 border-transparent hover:border-primary-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left Section - Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {application.job?.company?.charAt(0) || 'J'}
                      </div>
                      
                      <div className="flex-1">
                        <Link 
                          to={`/jobs/${application.job?._id}`}
                          className="text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors mb-1 inline-block"
                        >
                          {application.job?.title || 'Job Title'}
                        </Link>
                        <p className="text-gray-700 font-medium mb-2">
                          {application.job?.company || 'Company Name'}
                        </p>
                        
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {application.job?.location || 'Location'}
                          </span>
                          <span className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            {application.job?.jobType || 'Job Type'}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Applied {formatDate(application.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Status & Actions */}
                  <div className="flex flex-col lg:items-end gap-3">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="capitalize">{application.status}</span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/jobs/${application.job?._id}`}
                        className="btn-outline py-2 px-4 text-sm"
                      >
                        View Job
                      </Link>
                      
                      {(application.status === 'applied' || application.status === 'reviewing') && (
                        <button
                          onClick={() => handleWithdraw(application._id, application.job?.title)}
                          className="flex items-center gap-1 px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cover Letter Preview */}
                {application.coverLetter && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 font-medium mb-1">Cover Letter:</p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {application.coverLetter}
                    </p>
                  </div>
                )}

                {/* Job Status Warning */}
                {application.job?.status !== 'active' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>This job posting is no longer active</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Results Summary */}
        {filteredApplications.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Showing {filteredApplications.length} of {applications.length} applications
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
