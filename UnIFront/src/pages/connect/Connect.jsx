/**
 * Initial page for connect, card swipe feature. Commented out is a series of 3 initial cards for testing purposes.
 * 
 * @author @MMcClure313
 */

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
