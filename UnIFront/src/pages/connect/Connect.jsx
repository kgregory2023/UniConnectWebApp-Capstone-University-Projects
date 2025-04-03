/**NEW
 * Initial page for connect, card swipe feature. Commented out is a series of 3 initial cards for testing purposes.
 * 
 * @author @MMcClure313
 */

import { useState, React, useEffect } from 'react'; // Added useEffect for fetching users
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useUser } from '../../components/userContext/UserContext';
import CardSwipe from '../../components/cardSwipe/cardSwipe';
import './Connect.css';

function Connect() {
    const navigate = useNavigate();
    const { user, token } = useUser();

    // useEffect added to dynamically fetch users from the backend
    const [cards, setCards] = useState([]); // Replaced and restructured static initialCards with fetched cards from database

    useEffect(() => {
        const fetchSwipeUsers = async () => {
            try {
                const response = await fetch("http://localhost:5000/users/swipe/8", {
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
                    }));
                    setCards(formattedCards);
                } else {
                    console.error("Error fetching users:", data.message);
                }
            } catch (err) {
                console.error("Fetch failed:", err);
            }
        };

        fetchSwipeUsers();
    }, [token]);

    const handleSwipe = (direction, id) => {
        console.log(`Swiped ${direction} on card ${id}`);
        setCards(cards.filter(card => card.id !== id));
    };

    return (
        <div className="connect">
            <h1 className="padding-70">Connect</h1>
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
                    <p>No more!!!</p>
                )}
            </div>
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