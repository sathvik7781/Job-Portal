import { Link } from 'react-router-dom';
import { Briefcase, Users, TrendingUp, Search, ArrowRight, Sparkles, Target, Zap, Shield, Star, CheckCircle } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg mb-8 animate-fade-in-down">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-semibold text-gray-700">Over 10,000+ Jobs Available</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-6 animate-fade-in-up leading-tight">
            Find Your Dream Job
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              Start Your Journey
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto animate-fade-in font-light">
            Connect with top employers and discover opportunities that match your skills, 
            <span className="font-semibold text-gray-800"> unlock your potential</span>, and 
            <span className="font-semibold text-gray-800"> shape your future</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-fade-in-up animation-delay-200">
            <Link 
              to="/jobs" 
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Explore Jobs
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link 
              to="/register" 
              className="group px-8 py-4 bg-white/90 backdrop-blur-sm text-gray-900 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl border-2 border-gray-200 hover:border-blue-400 transform hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                Get Started Free
                <Sparkles className="h-5 w-5 text-yellow-500 group-hover:rotate-12 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600 animate-fade-in animation-delay-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>100% Free to Use</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Verified Companies</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Quick Apply</span>
            </div>
          </div>
        </div>

        {/* Stats Section with Enhanced Design */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up animation-delay-600">
          <div className="group relative bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-white/20 hover:scale-105 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-4xl font-extrabold text-gray-900 mb-2">1,000+</h3>
              <p className="text-gray-600 font-medium">Active Job Listings</p>
              <div className="mt-4 flex items-center gap-2 text-blue-600 font-semibold">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Updated daily</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-white/20 hover:scale-105 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-transparent rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-4xl font-extrabold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600 font-medium">Top Companies</p>
              <div className="mt-4 flex items-center gap-2 text-purple-600 font-semibold">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm">Verified partners</span>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-white/20 hover:scale-105 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-transparent rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-4xl font-extrabold text-gray-900 mb-2">5,000+</h3>
              <p className="text-gray-600 font-medium">Happy Job Seekers</p>
              <div className="mt-4 flex items-center gap-2 text-pink-600 font-semibold">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Success stories</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section with Modern Design */}
      <div className="relative py-24 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">JobPortal?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to find your perfect job or hire top talent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 hover:border-blue-300">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Search className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Smart Search</h3>
                <p className="text-gray-600 leading-relaxed">
                  Advanced filters and AI-powered recommendations help you find the perfect match instantly
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Top Companies</h3>
                <p className="text-gray-600 leading-relaxed">
                  Connect directly with leading companies and startups actively looking for talented professionals
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-pink-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-pink-100 hover:border-pink-300">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Quick Apply</h3>
                <p className="text-gray-600 leading-relaxed">
                  One-click applications with your saved profile. Apply to multiple jobs in seconds
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-indigo-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-indigo-100 hover:border-indigo-300">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Verified Jobs</h3>
                <p className="text-gray-600 leading-relaxed">
                  All listings are verified. No fake jobs, no scams. Your time is valuable
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-green-100 hover:border-green-300">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-green-500 to-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Career Growth</h3>
                <p className="text-gray-600 leading-relaxed">
                  Resources, tips, and opportunities to help you advance your career and reach new heights
                </p>
              </div>
            </div>

            <div className="group relative bg-gradient-to-br from-orange-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-orange-100 hover:border-orange-300">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all"></div>
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Community</h3>
                <p className="text-gray-600 leading-relaxed">
                  Join thousands of professionals sharing insights, tips, and success stories
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section with Modern Design */}
      <div className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-12 md:p-16 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="text-white font-semibold">Limited Time Offer</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Join thousands of job seekers and recruiters already using JobPortal to make meaningful connections
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="group px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    Create Free Account
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                
                <Link 
                  to="/jobs" 
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-lg border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                >
                  Browse Jobs
                </Link>
              </div>
              
              <div className="mt-10 flex flex-wrap justify-center gap-8 text-white/90">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
