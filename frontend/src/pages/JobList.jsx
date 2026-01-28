import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobAPI } from '../services/api';
import toast from 'react-hot-toast';
import { MapPin, Briefcase, DollarSign, Clock, Search } from 'lucide-react';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(search && { search }),
        ...(location && { location }),
        ...(jobType && { jobType }),
      };

      const response = await jobAPI.getAllJobs(params);
      setJobs(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [pagination.page, search, location, jobType]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchJobs();
  };

  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Not specified';
    return `${currency} ${min?.toLocaleString()} - ${max?.toLocaleString()}`;
  };

  const getJobTypeColor = (type) => {
    const colors = {
      'full-time': 'badge-success',
      'part-time': 'badge-info',
      'contract': 'badge-warning',
      'internship': 'badge-error',
      'remote': 'badge-info',
    };
    return colors[type] || 'badge-info';
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
          <p className="mt-2 text-gray-600">
            Discover your next career opportunity
          </p>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Job title, keywords..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="input-field"
              >
                <option value="">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>
          </form>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {jobs.length} of {pagination.total} jobs
        </div>

        {/* Job List */}
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No jobs found. Try adjusting your filters.</p>
            </div>
          ) : (
            jobs.map((job) => (
              <Link
                key={job._id}
                to={`/jobs/${job._id}`}
                className="block card hover:border-primary-200 border-2 border-transparent"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{job.company}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {job.experienceLevel}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency || 'USD')}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-gray-700 line-clamp-2 mb-3">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <span className={`badge ${getJobTypeColor(job.jobType)}`}>
                        {job.jobType}
                      </span>
                      {job.skills?.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="badge bg-gray-100 text-gray-700">
                          {skill}
                        </span>
                      ))}
                      {job.skills?.length > 3 && (
                        <span className="badge bg-gray-100 text-gray-700">
                          +{job.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex items-center px-4 text-gray-700">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.pages}
              className="btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;
