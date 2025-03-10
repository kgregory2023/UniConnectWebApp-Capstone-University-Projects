import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useUser } from '../../components/userContext/UserContext'; 
import './Profile.css';

function Profile() {
    const navigate = useNavigate();
    const { user, token, logout } = useUser();

    console.log(user);
    console.log(token);

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
            <h1 style={{ marginTop: '0px' }}>
                ~ Your Profile: ~
            </h1>
            <form onSubmit={handleCustomize} className='profileForm'>
                <div>
                    <label htmlFor="email">Email:</label>
                    <span>{user?.email}</span>
                </div>
                <div>
                    <label htmlFor="username">Username:</label>
                    <span>{user?.username}</span>
                </div>
                <div>
                    <label htmlFor="name">Name:</label>
                    <span>{user?.name}</span>
                </div>
                <div>
                    <label htmlFor="uni">University:</label>
                    <span>{user?.uni}</span>
                </div>
                <div>
                    <label htmlFor="phone">Phone #:</label>
                    <span>{user?.phone}</span>
                </div>
                <div>
                    <label htmlFor="bio">Bio:</label>
                    <span>{user?.bio}</span>
                </div>
                <div>
                    <label htmlFor="age">Age:</label>
                    <span>{user?.age}</span>
                </div>
                <button type="submit" className='submitButton'>Customize Profile</button>
            </form>
            <button className='deleteButton' onClick={handleDelete}> Delete Profile? </button>
        </div>
    );
}

export default Profile;
