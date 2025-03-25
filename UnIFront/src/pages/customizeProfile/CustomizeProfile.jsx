import { useState, useEffect } from 'react';
import { useUser } from '../../components/userContext/UserContext';
import { useNavigate } from 'react-router-dom';
import './CustomizeProfile.css';

function CustomizeProfile() {
    const navigate = useNavigate();
    const { user, token, login } = useUser();
    const [tempData, setTempData] = useState({});
    const [previewImage, setPreviewImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

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
                profilePic: user.profilePic || '',
            });
            
            if (user.profilePic) {
                setPreviewImage(user.profilePic);
            }
        }
    }, [user]);

    const handleTempChange = (e) => {
        setTempData({
            ...tempData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setTempData({
                    ...tempData,
                    profilePic: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (tempData.password !== tempData.password2) {
            setError('The passwords must match');
            return;
        }
    
        setError('');
        setIsLoading(true);
    
        try {
            // Create a copy of data to send to server
            const dataToUpdate = { ...tempData };
            
            // If password is empty, don't include it in the update
            if (!dataToUpdate.password) {
                delete dataToUpdate.password;
                delete dataToUpdate.password2;
            } else {
                delete dataToUpdate.password2;
            }
            
            const response = await fetch('http://localhost:5000/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToUpdate),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile.');
            }
            const updatedUser = await response.json();
            login(updatedUser, token); // Update frontend state
                
            navigate('/profile')

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
        
    return (
        <div className="profile-customization">
            <h1>~ Customize Your Profile ~</h1>
            
            {error && <div className="error-message">{error}</div>}
            {isLoading && <div className="loading-message">Updating profile...</div>}
            
            <div className="profile-content">
                <div className="profile-picture-section">
                    <div className="profile-picture-container">
                        {previewImage ? (
                            <img 
                                src={previewImage} 
                                alt="Profile Preview" 
                                className="profile-picture-preview" 
                            />
                        ) : (
                            <div className="profile-picture-placeholder">
                                No image selected
                            </div>
                        )}
                    </div>
                    <label className="profile-picture-upload">
                        <span>Choose Profile Picture</span>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            style={{display: 'none'}}
                        />
                    </label>
                </div>
                
                <form onSubmit={handleSubmit} className='profileCustomizationForm'>
                    <div className="form-group">
                        <label>
                            Username:   
                            <input 
                                type="text" 
                                name="username" 
                                value={tempData.username} 
                                onChange={handleTempChange} 
                            />
                        </label>
                    </div>
                    
                    <div className="form-group">
                        <label>
                            Name:   
                            <input 
                                type="text" 
                                name="name" 
                                value={tempData.name} 
                                onChange={handleTempChange} 
                            />
                        </label>
                    </div>
                    
                    <div className="form-group">
                        <label>
                            Phone #:   
                            <input 
                                type="text" 
                                name="phone" 
                                value={tempData.phone} 
                                onChange={handleTempChange} 
                            />
                        </label>
                    </div>
                    
                    <div className="form-group">
                        <label>
                            Bio:   
                            <textarea 
                                name="bio" 
                                value={tempData.bio} 
                                onChange={handleTempChange}
                                rows="3" 
                            />
                        </label>
                    </div>
                    
                    <div className="form-group">
                        <label>
                            Age:   
                            <input 
                                type="number" 
                                name="age" 
                                value={tempData.age} 
                                onChange={handleTempChange} 
                            />
                        </label>
                    </div>
                    
                    <div className="form-group password-group">
                        <h3>Change Password</h3>
                        <label>
                            New Password:   
                            <input 
                                type="password" 
                                name="password" 
                                value={tempData.password} 
                                onChange={handleTempChange}
                                placeholder="Enter your new password"
                            />
                        </label>
                        
                        <label>
                            Confirm Password:
                            <input 
                                type="password" 
                                name="password2" 
                                value={tempData.password2} 
                                onChange={handleTempChange}
                                placeholder="Confirm your new password"
                            />
                        </label>
                    </div>
                    
                    <div className="button-group">
                        <button type="submit" className="save-button">Save Changes</button>
                        <button type="button" className="cancel-button" onClick={() => navigate('/profile')}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CustomizeProfile;
