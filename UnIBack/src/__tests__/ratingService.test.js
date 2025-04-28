const mongoose = require("mongoose");
const Rating = require("../models/Rating");
const ratingService = require("../services/ratingService");
const { MongoMemoryServer } = require("mongodb-memory-server");


let mongoLocationServer;

mongoose.model('User', new mongoose.Schema({}));
beforeAll (async () => {
    mongoLocationServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoLocationServer.getUri());
});

afterAll (async () => {
    await mongoose.disconnect();
    await mongoLocationServer.stop();
});

describe("Rating Service", () => {
    afterEach (async () => {
        await Rating.deleteMany();
    });

    it("should create a new Rating", async () => {
        const userId = new mongoose.Types.ObjectId;
        const locationId = new mongoose.Types.ObjectId;
        const ratingData = {
            user: userId,
            location: locationId,
            value: 5,
            text: "test comment"
        };

        const rating = await ratingService.createRating(ratingData);
        expect(rating).toHaveProperty("_id");
        expect(rating.user).toBe(userId);
        expect(rating.location).toBe(locationId);
        expect(rating.value).toBe(5);
        expect(rating.text).toBe("test comment");
    });

    it("should throw an error if user ID is missing", async () => {
        const locationId = new mongoose.Types.ObjectId;
        const ratingData = {
            location: locationId,
            value: 5,
            text: "test comment"
        };

        await expect(ratingService.createRating(ratingData)).rejects.toThrow("You are not authorized to do that.");
    });

    it("should throw an error if value is not between 1 - 5", async () => {
        const userId = new mongoose.Types.ObjectId;
        const locationId = new mongoose.Types.ObjectId;
        const ratingData = {
            user: userId,
            location: locationId,
            value: 6,
            text: "test comment"
        };

        await expect(ratingService.createRating(ratingData)).rejects.toThrow("Rating value must be between 1 and 5.");
    });

    it("should throw an error if comment content is missing", async () => {
        const userId = new mongoose.Types.ObjectId;
        const locationId = new mongoose.Types.ObjectId;
        const ratingData = {
            user: userId,
            location: locationId,
            value: 5,
        };

        await expect(ratingService.createRating(ratingData)).rejects.toThrow("Comment text is a required field.");
    });

    it("should get all ratings", async () => {
        const userId = new mongoose.Types.ObjectId;
        const locationId = new mongoose.Types.ObjectId;
        const ratingDataOne = {
            user: userId,
            location: locationId,
            value: 5,
            text: "test one"
        };
        const ratingDataTwo = {
            user: userId,
            location: locationId,
            value: 1,
            text: "test two"
        };
        await ratingService.createRating(ratingDataOne);
        await ratingService.createRating(ratingDataTwo);

        const result = await ratingService.getAllRatings();
        expect(result).toBeDefined();
        expect(result).toHaveLength(2);
        expect(result[0].value).toBe(5);
        expect(result[1].value).toBe(1);
        expect(result[0].text).toBe("test one");
        expect(result[1].text).toBe("test two");
    });

    it("should return empty if no ratings", async () => {
        const result = await ratingService.getAllRatings();
        expect(result).toBeDefined();
        expect(result).toHaveLength(0);
    });

    it("should return a rating by its Id",async () => {
        const userId = new mongoose.Types.ObjectId;
        const locationId = new mongoose.Types.ObjectId;
        const ratingData = {
            user: userId,
            location: locationId,
            value: 5,
            text: "test comment"
        };
        const rating = await ratingService.createRating(ratingData);
        ratingId = rating.id;

        const result = await ratingService.getRatingById(ratingId);
        expect(result).toBeDefined();
        expect(result.value).toBe(5);
        expect(result.text).toBe("test comment");
    });

    it("should throw an error if no rating found", async () => {
        const ratingId = new mongoose.Types.ObjectId;
        await expect(ratingService.getRatingById(ratingId)).rejects.toThrow("Rating not found.");
    });

    it("should get all ratings by a specific userId", async () => {
        const userId = new mongoose.Types.ObjectId;
        const otherUser = new mongoose.Types.ObjectId;
        const locationId = new mongoose.Types.ObjectId;
        const ratingData = {
            user: userId,
            location: locationId,
            value: 5,
            text: "test comment"
        };
        const otherRatingData = {
            user: otherUser,
            location: locationId,
            value: 1,
            text: "other comment"
        };
        await ratingService.createRating(ratingData);
        await ratingService.createRating(otherRatingData);

        const result = await ratingService.getRatingsByUserId(userId);
        expect(result).toBeDefined();
        expect(result).toHaveLength(1);
        expect(result[0].value).toBe(5);
        expect(result[0].text).toBe("test comment");
    });

    it("should return null if no ratings", async () => {
        const result = await ratingService.getRatingsByUserId();
        expect(result).toBeDefined();
        expect(result).toHaveLength(0);
    });

    it("should get all ratings by a specific locationId", async () => {
        const userId = new mongoose.Types.ObjectId;
        const locationId = new mongoose.Types.ObjectId;
        const otherLocationId = new mongoose.Types.ObjectId;
        const ratingData = {
            user: userId,
            location: locationId,
            value: 5,
            text: "test comment"
        };
        const otherRatingData = {
            user: userId,
            location: otherLocationId,
            value: 1,
            text: "other comment"
        };
        await ratingService.createRating(ratingData);
        await ratingService.createRating(otherRatingData);

        const result = await ratingService.getRatingsByLocationId(locationId);
        expect(result).toBeDefined();
        expect(result).toHaveLength(1);
        expect(result[0].value).toBe(5);
        expect(result[0].text).toBe("test comment");
    });

    it("should return null if no ratings", async () => {
        const result = await ratingService.getRatingsByLocationId();
        expect(result).toBeDefined();
        expect(result).toHaveLength(0);
    });

    it("should find a rating by its Id and delete it", async () => {
        const userId = new mongoose.Types.ObjectId;
        const locationId = new mongoose.Types.ObjectId;
        const ratingData = {
            user: userId,
            location: locationId,
            value: 5,
            text: "test comment"
        };
        const rating = await ratingService.createRating(ratingData);
        ratingId = rating.id;

        await ratingService.deleteRatingById(ratingId);
        await expect(ratingService.getRatingById(ratingId)).rejects.toThrow("Rating not found.");
    });

    it("should throw an error if no rating found by Id", async () => {
        const ratingId = new mongoose.Types.ObjectId;
        await expect(ratingService.deleteRatingById(ratingId)).rejects.toThrow("Rating not found.");
    }); 
});