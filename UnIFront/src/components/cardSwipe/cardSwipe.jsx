
/**NEW
 * Component to make an animated card that'll swipe right and left based on user input, that will allow for actions based on swiping right or left.
 * The cards are also meant to be open for data to be dynamically loaded in.
 * 
 * @author @MMcClure313
 */

import { motion } from "framer-motion";
import { useState } from "react";

const CardSwipe = ({ card, onSwipe, style }) => {
  const [x, setX] = useState(0);

  const handleDrag = (event, info) => {
    setX(info.offset.x);
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 200) {
      onSwipe("right", card.id);
    } else if (info.offset.x < -200) {
      onSwipe("left", card.id);
    }
    setX(0);
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: -400, right: 400 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      animate={{ x }}
      style={{
        ...style,
        backgroundColor: "#fff",
        width: "300px",
        height: "450px",
        borderRadius: "12px",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "15px",
        boxSizing: "border-box"
      }}
    >
      <img
        src={card.profilePic || "/default-avatar.png"}
        alt="Profile"
        style={{
          width: "100%",
          height: "60%",
          objectFit: "cover",
          borderRadius: "8px"
        }}
      />

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <h2 style={{ margin: "5px 0", fontSize: "1.4rem", color: "#222" }}>
          {card.username || "No Name"}, {card.age || "??"}
        </h2>
        <p style={{ marginTop: "8px", color: "#444", fontSize: "0.95rem" }}>
          {card.bio || "This user hasn’t written a bio yet."}
        </p>
      </div>
    </motion.div>
  );
};

export default CardSwipe;

/**OLD
 * Component to make an animated card that'll swipe right and left based on user input, that will allow for actions based on swiping right or left.
 * The cards are also meant to be open for data to be dynamically loaded in.
 * 
 * @author @MMcClure313
 

import {motion} from "framer-motion";
import { useState } from "react";

const CardSwipe = ({ card , onSwipe, style }) => {
    const [x, setX] = useState(0);  // Track the current x position of the card

    const handleDrag = (event, info) => {
        setX(info.offset.x); 
    }


    const handleDragEnd = (event, info) =>{
            console.log(info.offset.x)
            if(info.offset.x > 200){ // Right case
                onSwipe("right", card.id);
            } else if(info.offset.x < -200){
                onSwipe("left", card.id);
            }

            setX(0);
        }


    return (
        <motion.div
            drag="x"
            dragConstraints={{left: -400, right: 400}}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            animate = {{ x }}
            style={{
                ...style,// Apply the passed style to position the card
                backgroundColor: 'white',
                width: '300px',
                height: '400px',
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',  // Optional shadow
                borderRadius: '10px',  // Rounded corners
            }
        }  
    >
        {card.text}
        </motion.div>
    );
};

export default CardSwipe
*/