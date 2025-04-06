/**NEW
 * Initial page for connect, card swipe feature. Commented out is a series of 3 initial cards for testing purposes.
 * 
 * @author @MMcClure313
 */

import { useState, React, useEffect } from 'react'; // Added useEffect for fetching users
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../components/userContext/UserContext';
import CardSwipe from '../../components/cardSwipe/cardSwipe';
import './Connect.css';

function Connect() {
    const navigate = useNavigate();
    const { user, token } = useUser();

    // useEffect added to dynamically fetch users from the backend
    const [cards, setCards] = useState([]); // Replaced and restructured static initialCards with fetched cards from database
    const [isLoading, setLoading] = useState(true);
    const [likedUsers, setLikedUsers] = useState([]);

    useEffect(() => {
        if (!token) return; //Not fetching if token isn't ready.

        const fetchSwipeUsers = async () => {
            try {
                const response = await fetch("http://localhost:5000/users/swipe/5", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Auth token is included in headers
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    const formattedCards = data.map(user => ({
                        id: user._id,
                        username: user.name || user.username, // Added the dynamic user mapping
                        age: user.age,
                        bio: user.bio,
                        profilePic: user.profilePic,
                        email: user.email,
                        tags: user.tags,
                    }));
                    console.log(formattedCards);
                    setCards(formattedCards);
                } else {
                    console.error("Error fetching users:", data.message);
                }
            } catch (err) {
                console.error("Fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSwipeUsers();
    }, [token]);

    const handleSwipe = (direction, id) => {
        console.log(`Swiped ${direction} on card ${id}`);

        const swipedUser = cards.find(card => card.id === id);//Grabs the entire card data for the contact

        if (direction === "right" && swipedUser) {
            setLikedUsers(prev => [...prev, swipedUser]);
        }

        setCards(cards.filter(card => card.id !== id));
    };

    // Handle deletion of a contact from the liked users list
    const handleDelete = (contactId) => {
        setLikedUsers(prevContacts => prevContacts.filter(contact => contact.id !== contactId));
    };

    return (

        <div className="connect">
            <h1 className="padding-70">Connect</h1>

            {isLoading ? (
                //Is loading
                <div className="loading">Finding users...</div>
            ) : (
                //Is ready
                <div className="connect-layout">
                    <div className="swipe-section">
                        <div className="swipe-icon red-x">❌</div>

                        <div className="card-stack">
                            {cards.length > 0 ? (
                                cards.map((card, index) => (
                                    <CardSwipe
                                        key={card.id}
                                        card={card}
                                        onSwipe={handleSwipe}
                                        style={{
                                            position: 'absolute',
                                            zIndex: cards.length - index,
                                            border: '1px solid black',
                                        }}
                                    />
                                ))
                            ) : (
                                <p>No More Users</p>
                            )}
                        </div>

                        <div className="swipe-icon green-check">✔</div>

                    </div>

                    <div className="contact-stack">
                        <h3>Contacts</h3>
                        {likedUsers.length > 0 ? (
                            likedUsers.map(user => (
                                <div key={user.id} className="contact-bar">
                                    <img
                                        src={user.profilePic || "/default-avatar.png"}
                                        alt={user.username}
                                        className="contact-icon"
                                    />
                                    <div className="contact-info">
                                        <p className="contact-name">{user.username}, {user.age}</p>
                                        <p className="contact-email">{user.email || "No email listed"}</p>
                                    </div>
                                    <button
                                        className="trash"
                                        onClick={() => handleDelete(user.id)} // Trigger the delete action
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No one's here yet, swipe right on people you find interesting!</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Connect;


/**OLD
 * Initial page for connect, card swipe feature. Commented out is a series of 3 initial cards for testing purposes.
 * 
 * @author @MMcClure313
 

import {useState, React } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useUser } from '../../components/userContext/UserContext';
import CardSwipe from '../../components/cardSwipe/cardSwipe';
import './Connect.css';

function Connect() {
    const navigate = useNavigate();
    const { user, token } = useUser();

    //Say this is where a function would live that would fetch users (30-50) from the database, sort and algorithmically serve the user 5-10 based on matching tags
    //That is why user and token are imported, as not now but later, we will have to check user tags against other user tags.

    const initialCards = [
        { id: 1, text: "Card 1" },
        { id: 2, text: "Card 2" },
        { id: 3, text: "Card 3" },
    ];

    const CardStack = () => {
        const [cards, setCards] = useState(initialCards);

        const handleSwipe = (direction, id) => {
            console.log(`Swiped ${direction} on card ${id}`);
            setCards(cards.filter(card => card.id !== id)); //I love JS and their array functions 😍
        }

        return (
                <div className="card-stack">
                    {cards.length > 0 ? (
                        cards.map((card, index) => <CardSwipe
                         key={card.id}
                         card={card}
                         onSwipe={handleSwipe} 
                         style={{
                            position: 'absolute',
                            zIndex: cards.length - index,  // Ensure they stack in order (front-to-back)
                            border: '1px solid black',
                         }}
                         />)

                    ) : (
                        <p>No more!!!</p>
                    )}
                </div>
        );
    } // This is the end of the CARDSTACK return.

    return (
        <div className="connect">
            <h1 className="padding-70">Connect</h1>
            <CardStack/>
        </div>
    )
}

export default Connect;

*/