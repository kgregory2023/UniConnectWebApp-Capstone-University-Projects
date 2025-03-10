import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useUser } from '../../components/userContext/UserContext'; 
import './Profile.css';

function Profile() {
    const navigate = useNavigate();
    const { user } = useUser();

    const handleCustomize = (event) => {
        event.preventDefault();
        navigate('/customizeProfile');
    };

    const handleDelete = (event) => {
        event.preventDefault();
        console.log();
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
            <form onSubmit={handleDelete} className='deleteForm'>
                <button type="submit" className='deleteButton'>Delete Profile</button>
            </form>
        </div>
    );
}

export default Profile;
