import { Link } from "react-router-dom";
import { useUser } from "../userContext/UserContext";
import './ProtectedRoute.css'; // Import the CSS file

const ProtectedRoute = ({ element }) => {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="overlay">
        <div className="modal">
          <h2>Access Restricted</h2>
          <p>You need to log in to access this page.</p>
          <div className="link-container">
            <div className="pair">
                <p>Have an account?</p>
                <Link to="/login">Login</Link>
            </div>
            <div className="pair">
                <p>Need an account?</p>
                <Link to="/register">Register</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return element;
};

export default ProtectedRoute;