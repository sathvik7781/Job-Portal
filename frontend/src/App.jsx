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
import JobDetail from './pages/JobDetail';
import MyApplications from './pages/MyApplications';
import MyJobs from './pages/MyJobs';

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
            <Route path="/jobs/:id" element={<JobDetail />} />
            
            {/* Protected Routes for Job Seekers */}
            <Route 
              path="/my-applications" 
              element={
                <ProtectedRoute>
                  <MyApplications />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Routes for Recruiters */}
            <Route 
              path="/my-jobs" 
              element={
                <ProtectedRoute requireRecruiter>
                  <MyJobs />
                </ProtectedRoute>
              } 
            />
            
            {/* Add more routes as needed */}
            {/* <Route path="/post-job" element={<ProtectedRoute requireRecruiter><PostJob /></ProtectedRoute>} /> */}
            {/* <Route path="/edit-job/:id" element={<ProtectedRoute requireRecruiter><EditJob /></ProtectedRoute>} /> */}
            {/* <Route path="/job/:id/applications" element={<ProtectedRoute requireRecruiter><JobApplications /></ProtectedRoute>} /> */}
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '10px',
                padding: '16px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
