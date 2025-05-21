import { useAuth } from '../hooks/useAuth';
import EmployeeList from '../components/EmployeeList';
import { Link } from 'react-router-dom'; // Import Link for navigation

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container my-5">
      <h1 className="display-4 text-center mb-4">
        Welcome {user ? user.username : 'to TeamPulse'}
      </h1>

      {/* Add Payroll Button for Admins */}
      {user && user.isAdmin && (
        <div className="mb-4 text-center">
          <Link to="/payrolls/new">
            <button className="btn btn-primary">Add Payroll</button>
          </Link>
        </div>
      )}

      {/* Show Employee List */}
      {user && <EmployeeList />}
    </div>
  );
};

export default Home;
