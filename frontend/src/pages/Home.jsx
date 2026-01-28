import { Link } from 'react-router-dom';
import { Briefcase, Users, TrendingUp, Search } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Dream Job
            <span className="text-primary-600"> Today</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with top employers and discover opportunities that match your skills and aspirations.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/jobs" className="btn-primary text-lg px-8 py-3">
              Browse Jobs
            </Link>
            <Link to="/register" className="btn-outline text-lg px-8 py-3">
              Get Started
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Briefcase className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">1000+</h3>
              <p className="text-gray-600">Active Jobs</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">500+</h3>
              <p className="text-gray-600">Companies</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <TrendingUp className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-gray-900">5000+</h3>
              <p className="text-gray-600">Job Seekers</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose JobPortal?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <Search className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Easy Job Search
              </h3>
              <p className="text-gray-600">
                Find the perfect job with our advanced search and filtering options.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <Users className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Top Companies
              </h3>
              <p className="text-gray-600">
                Connect with leading companies looking for talented professionals.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <TrendingUp className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Career Growth
              </h3>
              <p className="text-gray-600">
                Access opportunities that help you grow and advance your career.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-primary-600 rounded-2xl shadow-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-primary-100 mb-8 text-lg">
            Join thousands of job seekers and recruiters already using JobPortal
          </p>
          <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block">
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
