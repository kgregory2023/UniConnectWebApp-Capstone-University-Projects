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
    const [hasFetched, setHasFetched] = useState(false);

    /**
     * Function that finds the users, and applies an algorithm to figure out who should be presented first.
     * If no one is found to have a score, then it'll fetch more users.
     * @param {} attempts amount of attempts it has gone through (runs recursively)
     */
    const fetchSwipeUsers = async (attempts = 0) => {
        try {
            setLoading(true);

            const response = await fetch("http://localhost:5000/users/swipe/5", {
                headers: {
                    Authorization: `Bearer ${token}`, // Auth token is included in headers
                },
            });

            const data = await response.json();
            if (response.ok) {
                const userTags = user?.tags || [];

                const formattedCards = data.map(u => {
                    

                    let sumScore = 0;
                    const inTags = u.tags || [];
                    const matches = inTags.filter(tag => userTags.includes(tag)).length;
                    sumScore += matches;

                return{
                    id: u._id,
                    username: u.name || u.username, // Added the dynamic user mapping
                    age: u.age,
                    bio: u.bio,
                    profilePic: u.profilePic,
                    email: u.email,
                    tags: u.tags,
                    matchScore: matches,
                }
            });


            const totalScore = formattedCards.reduce((sum, u) => sum + u.matchScore, 0); //Adds all matchScore of users
            //console.log(totalScore);
            if(totalScore === 0 && attempts < 2){
                console.log(`Retrying fetch, onto ( ${attempts+1}/3 )`);
                fetchSwipeUsers(attempts + 1);
            }   else{
                formattedCards.sort((a, b) => b.matchScore - a.matchScore);
                setCards(formattedCards);
                setLoading(false);
            }

            } else {
                console.error("Error fetching users:", data.message);
            }
        } catch (err) {
            console.error("Fetch failed:", err);
        } finally {
            //setLoading(false);
        }
    };

    /**
     * On page render, does a fetch. Needed some cleaning because it would double call this and
     * cause odd bugs with the card stack
     */
    useEffect(() => {
        if (!token || hasFetched) return; //Not fetching if token isn't ready.

        setHasFetched(true)
        fetchSwipeUsers();
    }, [user, hasFetched]);

    const handleSwipe = (direction, id) => {
        console.log(`Swiped ${direction} on card ${id}`);

        const swipedUser = cards.find(card => card.id === id);//Grabs the entire card data for the contact

        if (direction === "right" && swipedUser) {

            const alreadyLiked = likedUsers.some(user => user.id == swipedUser.id);

            if(!alreadyLiked){ //Simple fix for the connect page. All it does is not add the user if they're already liked.
                setLikedUsers(prev => [...prev, swipedUser]);
            }
        }

        setCards(cards.filter(card => card.id !== id));
    };

    // Handle deletion of a contact from the liked users list
    const handleDelete = (contactId) => {
        setLikedUsers(prevContacts => prevContacts.filter(contact => contact.id !== contactId));
    };

    //Handle button
    const handleFindMoreUsers = () => {
        fetchSwipeUsers(0);   // Reset attempt count
    };

    return (
<div className="connect-wrapper">
        <div className="connect">
        <h1 className="connect-heading">Connect</h1>


            <div className="connect-layout">
                <div className="swipe-section">
                    <div className="swipe-icon red-x">❌</div>
                    {isLoading ? (
                        //Is loading
                        <div className="card-stack">Finding users...</div>
                    ) : (
                        <div className="card-stack fade-in">
                        <div className="card-stack">
                            {cards.length > 0 ? (
                                cards.map((card, index) => (
                                    <CardSwipe
                                        key={card.id}
                                        card={card}
                                        onSwipe={handleSwipe}
                                        isTopCard={index === 0}
                                        style={{
                                            position: 'absolute',
                                            zIndex: cards.length - index,
                                            border: '1px solid black',
                                        }}
                                    />
                                ))
                            ) : (
                                <div>
                                <button 
                                className="genButton"
                                onClick ={handleFindMoreUsers}
                                >
                                    Find more users
                                </button>



                                {/* <button
                                onClick ={makeTag}
                                >
                                    Secret ;)
                                </button> */}
                                </div> 
                            )}
                        </div>
                        </div>
                    )}

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

        </div>
        </div>
    );
}

export default Connect;