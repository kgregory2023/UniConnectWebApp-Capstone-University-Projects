/**
 * NavBar unit that will be present on all pages to allow easy navigation between different pages
 * author: @MMcClure313
 */

import { Link } from "react-router-dom";
import './Navbar.css';
import { useUser } from '../userContext/UserContext'

let Navbar = () => {
    const { user, logout } = useUser();



    return (
        <nav className="navbar">
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
                    <div style={{ display: 'flex', allignItems:'center'}}>
                        <li>
                            <span
                                onClick={logout}
                                className="navbar-item"
                                style={{ cursor: "pointer", marginLeft: "10px" }}
                            >
                                Logout
                            </span>
                        </li>
                        <li className="navbar-item">
                            Hello, {user.username}!
                        </li>
                    </div>
                )}


            </ul>
        </nav>
    );
};

export default Navbar