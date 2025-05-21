import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EmployeeProvider } from './context/EmployeeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EmployeeForm from './components/EmployeeForm';
import './styles/main.css';
import './styles/variables.css';
import './App.css';
import PayrollList from './components/PayrollList';
import PayrollForm from './components/PayrollForm';
import PayrollDetail from './components/PayrollDetail';
import 'bootstrap/dist/css/bootstrap.min.css';
import EmployeeList from './components/EmployeeList';
// Project imports (ONLY ONE SET OF THESE)
import ProjectsList from './pages/ProjectsList';
import ProjectForm from './pages/ProjectForm';
import ProjectDetails from './pages/ProjectDetails';


// new for leaves
// Add these imports with your other page imports
import LeavesList from './pages/LeavesList';
import LeaveForm from './pages/LeaveForm';
import LeaveDetails from './pages/LeaveDetails';



function App() {
  return (
    <Router>
      <AuthProvider>
        <EmployeeProvider>
          <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/employees" element={<EmployeeList />} />
                <Route path="/employees/new" element={<EmployeeForm />} />
                <Route path="/employees/:id" element={<EmployeeForm />} />
                <Route path="/payrolls" element={<PayrollList />} />
                <Route path="/payrolls/new" element={<PayrollForm />} />
                <Route path="/payrolls/:id" element={<PayrollDetail />} />
                <Route path="/projects" element={<ProjectsList />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/projects/new" element={<ProjectForm />} />
                <Route path="/projects/:id/edit" element={<ProjectForm />} />
                
                <Route path="/leaves" element={<LeavesList />} />
                <Route path="/leaves/:id" element={<LeaveDetails />} />
                <Route path="/leaves/new" element={<LeaveForm />} />
                <Route path="/leaves/:id/edit" element={<LeaveForm />} />
    
              </Routes>
            </main>
            <Footer />
          </div>
        </EmployeeProvider>
      </AuthProvider>
    </Router>
  );
}


export default App;