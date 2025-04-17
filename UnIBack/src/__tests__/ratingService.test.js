const mongoose = require("mongoose");
const Rating = require("../models/Rating");
const ratingService = require("../services/ratingService");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoLocationServer;

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
});