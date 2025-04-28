const ratingService = require("../services/ratingService");

exports.createRating = async (req, res) => {
    try {
            
            const userId = req.user.id;
            const locationId = req.params.locationId; // /locations/:locationId/ratings is what the route will look like
            const { value, text } = req.body;

            console.log(req.params);
            console.log("Rating submitted for location:", locationId);

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

exports.getAllRatings = async (req, res) => {
    try {
        const ratings = await ratingService.getAllRatings();
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
};

exports.getRatingById = async (req, res) => {
    try {
        const rating = await ratingService.getRatingById(req.params.id);
        res.status(200).json(rating);
    } catch (error) {
        if(error.message === "Rating not found."){
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
};

exports.getRatingsByUserId = async (req, res) => {
    try {
        const ratings = await ratingService.getRatingsByUserId(req.user.id);
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
};  

exports.getRatingsByLocationId = async (req, res) => {
    try {
        const ratings = await ratingService.getRatingsByLocationId(req.params.locationId);
        res.status(200).json(ratings);
    } catch (error) {
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
};

exports.deleteRatingById = async (req, res) => {
    const ratingId = req.params.id;

    try {
        await ratingService.deleteRatingById(ratingId);
        res.status(204).send();
    } catch (error) {
        if (error.message === "Rating not found.") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Internal server error: " + error.message });
    }
};