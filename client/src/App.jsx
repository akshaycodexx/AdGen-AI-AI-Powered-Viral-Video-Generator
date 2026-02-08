import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Generator from './pages/Generator';
import Community from './pages/Community';

function App() {
  return (
    <Router>
      <div className="min-h-screen text-white relative overflow-hidden">
        {/* Star Field Background */}
        <div className="fixed inset-0 pointer-events-none -z-10 bg-stars opacity-40"></div>
        <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b from-transparent via-background/50 to-background"></div>


        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/community" element={<Community />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/generate" element={<Generator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
