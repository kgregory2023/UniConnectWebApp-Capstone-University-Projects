import { useState, useEffect } from 'react';
import { useUser } from '../../components/userContext/UserContext'; 
import './CustomizeProfile.css';

function CustomizeProfile() {
    const { user } = useUser();
    const [tempData, setTempData] = useState({});

    useEffect(() => {
        if (user) {
            setTempData({
                username: user.username || '',
                name: user.name || '',
                phoneNumber: user.phone || '',
                bio: user.bio || '',
                age: user.age || '',
                password: '',
            });
        }
    }, [user]);

    const handleTempChange = (e) => {
        setTempData({
            ...tempData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
    };
        
      /*  I also think there should be some additional fields like graduation month,year or at least the year*/
    return (
        <div className="profile-customization">
            <h1 style={{ marginTop: '0px' }}>~ Customize Your Profile: ~</h1>
            <form onSubmit={handleSubmit} className='profileCustomizationForm'>
                <label>
                    Username:   
                    <input 
                        type="text" 
                        name="username" 
                        value={tempData.username} 
                        onChange={handleTempChange} 
                    />
                </label>
                <label>
                    Name:   
                    <input 
                        type="text" 
                        name="name" 
                        value={tempData.name} 
                        onChange={handleTempChange} 
                    />
                </label>
                <label>
                    Phone #:   
                    <input 
                        type="text" 
                        name="phoneNumber" 
                        value={tempData.phoneNumber} 
                        onChange={handleTempChange} 
                    />
                </label>
                <label>
                    Bio:   
                    <input 
                        type="text" 
                        name="bio" 
                        value={tempData.bio} 
                        onChange={handleTempChange} 
                    />
                </label><label>
                    Age:   
                    <input 
                        type="text" 
                        name="age" 
                        value={tempData.age} 
                        onChange={handleTempChange} 
                    />
                </label>
                {/* I added this one temporarily, obviously we need to make it more secure.
                    Also need password validation but wasn't sure if that gets done in the frontend */}
                <label>
                    Password:   
                    <input 
                        type="password" 
                        name="password" 
                        value={tempData.password} 
                        onChange={handleTempChange}
                        placeholder="Enter your new password"
                    />
                </label>
                <label>
                    Re-enter Password:
                    <input 
                        type="password" 
                        name="password" 
                        value={tempData.password} 
                        onChange={handleTempChange}
                        placeholder="Enter your new password"
                    />
                </label>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default CustomizeProfile;
