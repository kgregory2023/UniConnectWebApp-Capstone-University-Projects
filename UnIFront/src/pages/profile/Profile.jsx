import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useUser } from '../../components/userContext/UserContext'; 
import './Profile.css';

function Profile() {
    const navigate = useNavigate();
    const { user, token, logout } = useUser();
    const [tagDetails, setTagDetails] = useState([]);
    const [isLoadingTags, setIsLoadingTags] = useState(false);

    // Fetch tag details if needed
    useEffect(() => {
        if (user?.tags && user.tags.length > 0) {
            // If tags are already objects with name property, use them directly
            if (typeof user.tags[0] === 'object' && user.tags[0].name) {
                setTagDetails(user.tags);
                return;
            }

            // Otherwise, fetch tag details
            const fetchTagDetails = async () => {
                setIsLoadingTags(true);
                try {
                    const response = await fetch('http://localhost:5000/profile/tags', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to fetch tags: ${response.status}`);
                    }

                    const allTags = await response.json();
                    
                    // Filter to only include user's tags
                    const userTagsWithDetails = allTags.filter(tag => 
                        user.tags.includes(tag._id)
                    );
                    
                    setTagDetails(userTagsWithDetails);
                } catch (error) {
                    console.error('Error fetching tag details:', error);
                } finally {
                    setIsLoadingTags(false);
                }
            };

            fetchTagDetails();
        }
    }, [user, token]);

    const handleCustomize = (event) => {
        event.preventDefault();
        navigate('/customizeProfile');
    };

    const handleDelete = async (event) => {
        event.preventDefault();
    
        if (!user) {
            console.log('No user data found.');
            return;
        }

        const isConfirmed = window.confirm('Are you sure you want to delete your profile? This action cannot be undone.');
        if (!isConfirmed) {
            console.log('Profile deletion canceled.');
            return;
        }

        if (!token) {
            console.log('No auth token found.');
            return;
            }

        try {        
            const response = await fetch(`http://localhost:5000/users/profile`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Profile deleted successfully');
                logout();
                navigate('/login');
            } else {
                const data = await response.json();
                console.error('Failed to delete profile:', data);
            }
        } catch (error) {
        console.error('Error deleting profile:', error);
        }
    };

    return (
        <div className='profile'>
            <h1>{user?.username}</h1>
            
            <div className="profile-content">
                <div className="profile-picture-section">
                    <div className="profile-picture-container">
                        {user?.profilePic ? (
                            <img 
                                src={user.profilePic} 
                                alt="Profile" 
                                className="profile-picture-preview" 
                            />
                        ) : (
                            <div className="profile-picture-placeholder">
                                No profile image
                            </div>
                        )}
                    </div>
                </div>
                
                <form onSubmit={handleCustomize} className='profileForm'>
                    <div>
                        <span>{user?.name}</span>
                    </div>
                    <div>
                        <span>{user?.uni}</span>
                    </div>
                    <div>
                        <span className="bio-text">{user?.bio}</span>
                    </div>
                    
                    {/* Tags section */}
                    {tagDetails.length > 0 && (
                        <div className="profile-tags-section">
                            <h3>Tags</h3>
                            <div className="profile-tags-container">
                                {tagDetails.map(tag => (
                                    <div key={tag._id} className="tag">
                                        {tag.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {isLoadingTags && (
                        <div className="loading-tags">Loading tags...</div>
                    )}
                    
                    <button type="submit" className='submitButton'>Customize Profile</button>
                </form>
                <button className='deleteButton' onClick={handleDelete}> Delete Profile? </button>
            </div>
        </div>
    );
}

export default Profile;
