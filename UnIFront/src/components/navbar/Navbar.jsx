/**
 * NavBar unit that will be present on all pages to allow easy navigation between different pages
 * author: @MMcClure313
 */

import { Link } from "react-router-dom";
import './Navbar.css';
import { useUser } from '../userContext/UserContext'

let Navbar = () => {
    const { user, logout, login } = useUser();

    const testLogin = () =>{
        login('user');
    };



    return (
        <nav className = "navbar">
                <ul>
                    <li>
                        <Link to="/" className="navbar-item">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/connect" className="navbar-item">
                            Connect
                        </Link>
                    </li>
                    <li>
                        <Link to="/discover" className="navbar-item">
                            Discover
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className="navbar-item">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile" className="navbar-item">
                            Profile
                        </Link>
                    </li>
                    {(!user) ? (
                    <li>
                        <Link to="/login" className="navbar-item">
                            Log In
                        </Link>
                    </li>
                    ) : (
                        <li
                        >Hello, {user.username}
                        <button onClick={logout} className="navbar-item">Logout</button>
                        </li> 
                    )}


                </ul>
        </nav>
    );
};

export default Navbar