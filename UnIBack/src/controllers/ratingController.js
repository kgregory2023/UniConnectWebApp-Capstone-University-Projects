const ratingService = require("../services/ratingService");

exports.createRating = async (req, res) => {
    try {
            const userId = req.user.id;
            const locationId = req.params.locationId; // /locations/:locationId/ratings is what the route will look like
            const { value, text } = req.body;

            const rating = await ratingService.createRating({
                user: userId,
                location: locationId,
                value: value,
                text: text
            });
            res.status(201).json(rating);
        } catch (error) {
            if(error.message === "You are not authorized to do that."){
                return res.status(401).json({ message: error.message });
            }
            if(error.message === "Rating value must be between 1 and 5."){
                return res.status(409).json({ message: error.message });
            }
            if(error.message === "Comment text is a required field."){
                return res.status(409).json({ message: error.message });
            }
            res.status(500).json({ message: "Internal server error: " + error.message });
        }
};