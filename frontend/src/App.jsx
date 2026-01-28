import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobList from './pages/JobList';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<JobList />} />
            
            {/* Add more routes here as we build them */}
            {/* <Route path="/jobs/:id" element={<JobDetail />} /> */}
            {/* <Route path="/post-job" element={<ProtectedRoute requireRecruiter><PostJob /></ProtectedRoute>} /> */}
            {/* <Route path="/my-jobs" element={<ProtectedRoute requireRecruiter><MyJobs /></ProtectedRoute>} /> */}
            {/* <Route path="/my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} /> */}
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
