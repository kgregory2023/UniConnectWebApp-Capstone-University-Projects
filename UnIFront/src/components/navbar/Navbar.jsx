/**
 * NavBar unit that will be present on all pages to allow easy navigation between different pages
 * author: @MMcClure313
 */

import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';
import { useUser } from '../userContext/UserContext'

let Navbar = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate('/');
    };



    return (
        <nav className="navbar">
            <ul style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
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
                {(!user) ? (
                    <li>
                        <Link to="/login" className="navbar-item">
                            Log In
                        </Link>
                    </li>
                ) : (
                    <>
                        <li>
                            <span
                                onClick={handleLogout}
                                className="navbar-item"
                                style={{ cursor: "pointer" }}
                            >
                                Logout
                            </span>
                        </li>
                        <li>
                            <Link to="/profile" className="navbar-item" style={{ display: 'flex', alignItems: 'center' }}>
                                {user?.profilePic ? (
                                    <img 
                                        src={user.profilePic} 
                                        alt="Profile" 
                                        style={{ 
                                            width: '35px', 
                                            height: '35px', 
                                            borderRadius: '50%',
                                        }} 
                                    />
                                ) : (
                                    <div 
                                        style={{ 
                                            width: '35px', 
                                            height: '35px', 
                                            borderRadius: '50%',
                                            backgroundColor: '#ccc',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '10px'
                                        }}
                                    >
                                        {user.username?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </Link>
                        </li>
                    </>
                )}


            </ul>
        </nav>
    );
};

export default Navbar