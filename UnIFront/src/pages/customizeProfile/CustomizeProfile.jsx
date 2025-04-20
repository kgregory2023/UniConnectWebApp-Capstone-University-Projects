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
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagsByCategory, setTagsByCategory] = useState({});

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
                tags: user.tags || [],
            });
            
            if (user.profilePic) {
                setPreviewImage(user.profilePic);
            }
        }

        // Fetch all tags
        const fetchTags = async () => {
            try {
                console.log('Fetching tags...');
                const response = await fetch('http://localhost:5000/profile/tags', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                console.log('Tags API response status:', response.status);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch tags: ${response.status} ${response.statusText}`);
                }

                const tagsData = await response.json();
                console.log('Tags data received:', tagsData);
                setTags(tagsData);

                // Group tags by category
                const groupedTags = {};
                if (Array.isArray(tagsData) && tagsData.length > 0) {
                    tagsData.forEach(tag => {
                        if (tag && tag.category) {
                            if (!groupedTags[tag.category]) {
                                groupedTags[tag.category] = [];
                            }
                            groupedTags[tag.category].push(tag);
                        } else {
                            console.warn('Invalid tag data:', tag);
                        }
                    });
                    console.log('Tags grouped by category:', groupedTags);
                } else {
                    console.warn('No tags data received or data is not an array');
                }
                
                setTagsByCategory(groupedTags);
                
                // Set selected tags using full tag objects that match user.tags IDs
                if (user && user.tags && Array.isArray(user.tags) && tagsData.length > 0) {
                    if (typeof user.tags[0] === 'object' && user.tags[0]._id) {
                        setSelectedTags(user.tags);
                    } 
                    else {
                        const userTagIds = Array.isArray(user.tags) ? user.tags : [];
                        const fullTagObjects = tagsData.filter(tag => 
                            userTagIds.includes(tag._id)
                        );
                        console.log('Setting selected tags with full objects:', fullTagObjects);
                        setSelectedTags(fullTagObjects);
                    }
                }
            } catch (err) {
                console.error('Error fetching tags:', err);
                setError('Could not load tags. Please try again later.');
            }
        };

        fetchTags();
    }, [user, token]);

    const handleTempChange = (e) => {
        setTempData({
            ...tempData,
            [e.target.name]: e.target.value
        });
    };

    const handleTagSelection = (tag) => {
        console.log('Tag selected/deselected:', tag);
        if (selectedTags.some(selectedTag => selectedTag._id === tag._id)) {
            // If tag is already selected remove it
            const updatedTags = selectedTags.filter(selectedTag => selectedTag._id !== tag._id);
            console.log('Removing tag, updated selection:', updatedTags);
            setSelectedTags(updatedTags);
        } else {
            // If tag is not selected and we haven't reached the limit, add it
            if (selectedTags.length < 10) {
                const updatedTags = [...selectedTags, tag];
                console.log('Adding tag, updated selection:', updatedTags);
                setSelectedTags(updatedTags);
            } else {
                console.log('Tag limit reached (10)');
                setError('You can only select up to 10 tags.');
                setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
            }
        }
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
            
            // Add selected tags to the data to update
            dataToUpdate.tags = selectedTags.map(tag => tag._id);
            
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

    // Render a tag with selection functionality
    const renderTag = (tag) => {
        if (!tag || !tag._id || !tag.name) {
            console.warn('Invalid tag provided to renderTag:', tag);
            return null;
        }
        
        const isSelected = selectedTags.some(selectedTag => selectedTag._id === tag._id);
        return (
            <div 
                key={tag._id} 
                className={`tag ${isSelected ? 'selected' : ''}`}
                onClick={() => handleTagSelection(tag)}
            >
                {tag.name}
            </div>
        );
    };
    
        
    return (
        <div className="customize-bg-wrapper">
        <div className="customize-profile-page">
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

                    <div className="form-group tags-section">
                        <h3>Select Your Tags (Choose up to 10)</h3>
                        <div className="tags-counter">
                            <span>{selectedTags.length} / 10 selected</span>
                        </div>
                        <div className="tags-container">
                            {Object.keys(tagsByCategory).length > 0 ? (
                                Object.keys(tagsByCategory).map(category => (
                                    <div key={category} className="tag-category">
                                        <h4>{category}</h4>
                                        <div className="tag-group">
                                            {tagsByCategory[category].map(tag => renderTag(tag))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="loading-message">Loading tags or no tags available...</div>
                            )}
                        </div>
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
        </div>
        </div>
    );
}

export default CustomizeProfile;
