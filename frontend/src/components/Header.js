// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';

// const Header = () => {
//   const { user, logout, isAdmin } = useAuth(); // Make sure isAdmin is included in your useAuth hook
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <>
//       {/* Top Navbar */}
//       <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
//         <div className="container d-flex justify-content-between align-items-center">
//           <Link to="/" className="navbar-brand">
//             TeamPulse
//           </Link>

//           {user ? (
//             <div className="d-flex align-items-center">
//               {/* Add Project Button - Only visible to admins */}
//               {isAdmin && (
//                 <Link 
//                   to="/projects/new" 
//                   className="btn btn-light btn-sm me-2"
//                 >
//                   <i className="fas fa-plus me-1"></i> Add Project
//                 </Link>
//               )}
//               <button 
//                 className="btn btn-danger btn-sm" 
//                 onClick={handleLogout}
//               >
//                 Logout
//               </button>
//             </div>
//           ) : (
//             <ul className="navbar-nav ms-auto">
//               <li className="nav-item me-2">
//                 <Link to="/login" className="nav-link">
//                   Login
//                 </Link>
//               </li>
//             </ul>
//           )}
//         </div>
//       </nav>

//       {/* Secondary Navbar */}
//       {user && (
//         <nav className="navbar navbar-expand-lg navbar-light bg-light border-top">
//           <div className="container">
//             <ul className="navbar-nav">
//               <li className="nav-item me-3">
//                 <Link to="/" className="nav-link">
//                   Dashboard
//                 </Link>
//               </li>
//               <li className="nav-item me-3">
//                 <Link to="/employees" className="nav-link">
//                   Employees
//                 </Link>
//               </li>
//               <li className="nav-item me-3">
//                 <Link to="/payrolls" className="nav-link">
//                   Payroll
//                 </Link>
//               </li>
//               {/* Optional: Add Projects link to secondary nav if needed */}
//               <li className="nav-item">
//                 <Link to="/projects" className="nav-link">
//                   Projects
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </nav>
//       )}
//     </>
//   );
// };

// export default Header;

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="navbar-brand">
            Employee Manager
          </Link>

          {user ? (
            <div className="d-flex align-items-center text-white">
              <span className="me-3">Welcome, {user.username}</span>
              <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item me-2">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>

      {/* Secondary Navbar */}
      {user && (
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-top">
          <div className="container">
            <ul className="navbar-nav">
              <li className="nav-item me-3">
                <Link to="/" className="nav-link">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item me-3">
                <Link to="/employees" className="nav-link">
                  Employees
                </Link>
              </li>
              <li className="nav-item me-3">
                <Link to="/payrolls" className="nav-link">
                  Payroll
                </Link>
              </li>
              <li className="nav-item me-3">
                <Link to="/projects" className="nav-link">
                  Projects
                </Link>
              </li>
              <li className="nav-item me-3">
                <Link to="/leaves" className="nav-link">
                  Leave Management
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      )}
    </>
  );
};

export default Header;
