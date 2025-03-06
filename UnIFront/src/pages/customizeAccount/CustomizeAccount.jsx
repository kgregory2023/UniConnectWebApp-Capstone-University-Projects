import { useState } from 'react';
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Updated account details:", formData);
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
                        value={formData.username} 
                        onChange={handleChange} 
                    />
                </label>
                <label>
                    Name:
                    <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                    />
                </label>
                <label>
                    Bio:
                    <input 
                        type="text" 
                        name="bio" 
                        value={formData.bio} 
                        onChange={handleChange} 
                    />
                </label>
                <label>
                    University:
                    <input 
                        type="text" 
                        name="university" 
                        value={formData.university} 
                        onChange={handleChange} 
                    />
                </label>
                <label>
                    Email:
                    <input 
                        type="text" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                    />
                </label>
                <label>
                    Phone Number:
                    <input 
                        type="text" 
                        name="phoneNumber" 
                        value={formData.phoneNumber} 
                        onChange={handleChange} 
                    />
                </label>
                {/* I added this one temporarily, obviously we need to make it more secure.
                    Also need password validation but wasn't sure if that gets done in the frontend */}
                <label>
                    Password:
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange}
                        placeHolder="Enter your new password"
                    />
                </label>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}

export default AccountCustomization;
