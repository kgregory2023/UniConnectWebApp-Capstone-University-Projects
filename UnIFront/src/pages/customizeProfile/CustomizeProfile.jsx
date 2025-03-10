import { useState, useEffect } from 'react';
import { useUser } from '../../components/userContext/UserContext'; 
import './CustomizeProfile.css';

function CustomizeProfile() {
    const { user, token, login } = useUser(); // updateUser will refresh the user context
    const [tempData, setTempData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setTempData({
                username: user.username || '',
                name: user.name || '',
                phone: user.phone || '',
                bio: user.bio || '',
                age: user.age || '',
                password: '',
                password2: '',
            });
        }
    }, [user]);

    const handleTempChange = (e) => {
        setTempData({
            ...tempData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (tempData.password !== tempData.password2) {
            setError('The passwords must match');
            return;
        }
    
        setError('');
        setMessage('');
        setIsLoading(true);
    
        try {
            const response = await fetch('http://localhost:5000/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(tempData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile.');
            }
    
            const updatedUser = await response.json();
            login(updatedUser, token); // Update frontend state
    
            setMessage("Profile updated successfully!");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
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
                        name="phone" 
                        value={tempData.phone} 
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
                        name="password2" 
                        value={tempData.password2} 
                        onChange={handleTempChange}
                        placeholder="Confirm your new password"
                    />
                </label>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default CustomizeProfile;
