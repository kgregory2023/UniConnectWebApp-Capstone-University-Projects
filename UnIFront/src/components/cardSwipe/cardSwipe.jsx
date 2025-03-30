/**
 * Component to make an animated card that'll swipe right and left based on user input, that will allow for actions based on swiping right or left.
 * The cards are also meant to be open for data to be dynamically loaded in.
 */

import {motion} from "framer-motion";
import { useState } from "react";

const cardSwipe = ({ card , onSwipe}) => {
    return (
        <motion.div
            drag="x"
            dragConstraints={{left: -100, right: 100}}
            onDragEnd={
                (event, info) =>{ //Not sure why event is needed here, the onDragEnd example has it, but info is where all the knowledge of 'where' the pointer/card is on drag end.
                    if(info.offset.x > 100){ // Right case
                        onSwipe("right", card.id);
                    } else if(info.offset.x < 100){
                        onSwipe("left", card.id);
                    }

                }
            }
            className="bg-white flex items-center p-6 w-100 h-160 justify-center text-2xl font-bold cursor-grab"
    >
        </motion.div>
    );
};

export default cardSwipe