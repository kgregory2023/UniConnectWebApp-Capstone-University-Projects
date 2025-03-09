import { useState } from 'react';
import {useEffect} from 'react';
import './CustomizeAccount.css';

function AccountCustomization() {
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        email: '',
        password: '',
        phoneNumber: '',
        university: '',
        username: '',
    });

    {/* Temporary values used to store the data before submitting it.*/}
    const [tempData, setTempData] = useState({ ...formData});

    const handleTempChange = (e) => {
        setTempData({
            ...tempData,
            [e.target.name]: e.target.value
        });
    };

    {/* Added this in in order to check if/ when the form data is updated. Can be deleted later once we
        know everything works smoothly*/}
    useEffect(() => {
        console.log("Current account details:", formData);
    }, [formData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormData(tempData);
        console.log("Updated account details:", tempData);
        alert("Account updated successfully!");
    };

    {/* For most of these, placeholders should be added in the future to show what they currently are
        Ex: current name, bio, etc... 
        
        I also think there should be some additional fields like graduation month,year or at least the year*/}
    return (
        <div className="account-customization">
            <h1>Customize Your Account</h1>
            <form onSubmit={handleSubmit}>
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
                    Bio:
                    <input 
                        type="text" 
                        name="bio" 
                        value={tempData.bio} 
                        onChange={handleTempChange} 
                    />
                </label>
                <label>
                    University:
                    <input 
                        type="text" 
                        name="university" 
                        value={tempData.university} 
                        onChange={handleTempChange} 
                    />
                </label>
                <label>
                    Email:
                    <input 
                        type="text" 
                        name="email" 
                        value={tempData.email} 
                        onChange={handleTempChange} 
                    />
                </label>
                <label>
                    Phone Number:
                    <input 
                        type="text" 
                        name="phoneNumber" 
                        value={tempData.phoneNumber} 
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
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default AccountCustomization;
