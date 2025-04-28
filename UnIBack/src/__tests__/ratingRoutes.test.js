const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const ratingController = require("../controllers/ratingController");
const ratingService = require("../services/ratingService");
const app = require("../config/app");
const locationRoutes = require("../routes/locationsRoutes");

jest.mock("../../authMiddleware", () => (req, res, next) => {
    req.user = { id: "mock-user-id", role: "user" }; // Mock user with role
    next();
  });
  
  jest.mock("../../roleMiddleware", () => (allowedRoles) => (req, res, next) => {
    req.user = { id: "mock-user-id", role: "user" }; // Mock role for test
    next();
  });
  
jest.mock("../services/ratingService");

app.use(express.json());
app.use("/locations", locationRoutes);

describe("Rating Routes", () => {
    let mockRating;
    let mockUser;
    let mockLocation;

    beforeAll(() => {
        jest.setTimeout(10000);

        mockUser = {
            _id: "mock-user-id",
            username: "test",
            email: "test@example.com",
            password: "12345678" 
        };

        mockLocation = {
            _id: new mongoose.Types.ObjectId(),
            name: "testLocation",
            address: "0000 test address",
            city: "testCity"
        }

        mockRating = {
            _id: new mongoose.Types.ObjectId(),
            user: mockUser._id,
            location: mockLocation._id,
            value: 5,
            text: "test comment"
        };
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    describe("POST /locations/:locationId/ratings", () => {
        it("should return 201 and a new created Rating", async () => {
            ratingService.createRating.mockResolvedValue(mockRating);

            const response = await request(app)
            .post(`/locations/${mockLocation._id.toString()}/ratings`)
            .send({
                value: 5,
                text: "test comment"
            });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("_id");
            expect(response.body.user).toBe(mockUser._id.toString());
            expect(response.body.location).toBe(mockLocation._id.toString());
            expect(response.body.value).toBe(5);
            expect(response.body.text).toBe("test comment");
        });

        it("should return 401 if non-authorized user tries to leave a rating", async () => {
            ratingService.createRating.mockRejectedValue(new Error("You are not authorized to do that."));

            const response = await request(app)
            .post(`/locations/${mockLocation._id.toString()}/ratings`)
            .send({
                value: 5,
                text: "test comment"
            });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe("You are not authorized to do that.");
        });

        it("should return 409 if value isn't between 1-5", async () => {
            ratingService.createRating.mockRejectedValue(new Error("Rating value must be between 1 and 5."));

            const response = await request(app)
            .post(`/locations/${mockLocation._id.toString()}/ratings`)
            .send({
                value: 5,
                text: "test comment"
            });

            expect(response.status).toBe(409);
            expect(response.body.message).toBe("Rating value must be between 1 and 5.");
        });

        it("should return 409 if comment left empty", async () => {
            ratingService.createRating.mockRejectedValue(new Error("Comment text is a required field."));

            const response = await request(app)
            .post(`/locations/${mockLocation._id.toString()}/ratings`)
            .send({
                value: 5,
                text: "test comment"
            });

            expect(response.status).toBe(409);
            expect(response.body.message).toBe("Comment text is a required field.");
        });

        it("should return 500 if unexpected error occurs", async () => {
            ratingService.createRating.mockRejectedValue(new Error("Database failure."));

            const response = await request(app)
            .post(`/locations/${mockLocation._id.toString()}/ratings`)
            .send({
                value: 5,
                text: "test comment"
            });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Internal server error: Database failure.");
        });
    });

    describe("GET /locations/:locationId/ratings/user", () => {
        it("should return 200 and a list of all ratings by a specific user", async () => {
            ratingService.getRatingsByUserId.mockResolvedValue([mockRating]);

            const response = await request(app)
            .get(`/locations/${mockLocation._id.toString()}/ratings/user`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].user).toBe(mockUser._id.toString());
            expect(response.body[0].location).toBe(mockLocation._id.toString());
            expect(response.body[0].value).toBe(5);
            expect(response.body[0].text).toBe("test comment")
        });

        it("should return 200 and an empty list if no ratings by a specific user", async () => {
            ratingService.getRatingsByUserId.mockResolvedValue([]);

            const response = await request(app)
            .get(`/locations/${mockLocation._id.toString()}/ratings/user`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(0);
        });

        it("should return 500 if unexpected error occurs", async () => {
            ratingService.getRatingsByUserId.mockRejectedValue(new Error("Database failure."));

            const response = await request(app)
            .get(`/locations/${mockLocation._id.toString()}/ratings/user`);
    
            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Internal server error: Database failure.")
        });
    });

    describe("GET /locations/:locationId/ratings", () => {
        it("should return 200 and a list of all ratings", async () => {
            ratingService.getAllRatings.mockResolvedValue([mockRating]);

            const response = await request(app)
            .get(`/locations/${mockLocation._id.toString()}/ratings`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].user).toBe(mockUser._id.toString());
            expect(response.body[0].location).toBe(mockLocation._id.toString());
            expect(response.body[0].value).toBe(5);
            expect(response.body[0].text).toBe("test comment");
        });

        it("should return 200 and an empty list if no ratings exist", async () => {
            ratingService.getAllRatings.mockResolvedValue([]);

            const response = await request(app)
            .get(`/locations/${mockLocation._id.toString()}/ratings`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(0);
        });

        it("should return 500 if unexpected error occurs", async () => {
            ratingService.getAllRatings.mockRejectedValue(new Error("Database failure."));

            const response = await request(app)
            .get(`/locations/${mockLocation._id.toString()}/ratings`);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Internal server error: Database failure.");
        });
    });

    describe("GET /locations/:locationId/ratings/location/:id", () => {
        it("should return 200 and a list of all ratings by a location's id", async () => {
            ratingService.getRatingsByLocationId.mockResolvedValue([mockRating]);
    
            const response = await request(app)
            .get(`/locations/${mockLocation._id.toString()}/ratings/location/${mockLocation._id.toString()}`);
    
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].user).toBe(mockUser._id.toString());
            expect(response.body[0].location).toBe(mockLocation._id.toString());
        });
    
        it("should return 200 and an empty list if no ratings with that locationId", async () => {
            ratingService.getRatingsByLocationId.mockResolvedValue([]);
    
            const response = await request(app)
            .get(`/locations/${mockLocation._id.toString()}/ratings/location/${mockLocation._id.toString()}`);
    
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(0);
        });
    
        it("should return 500 if unexpected error occurs", async () => {
            ratingService.getRatingsByLocationId.mockRejectedValue(new Error("Database failure."));
    
            const response = await request(app)
            .get(`/locations/${mockLocation._id.toString()}/ratings/location/${mockLocation._id.toString()}`);
    
            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Internal server error: Database failure.");
        });
    });

    describe("GET /locations/:locationId/ratings/:id", () => {
        it("should return 200 and a rating by its Id", async () => {
            ratingService.getRatingById.mockResolvedValue(mockRating);
    
            const response = await request(app)
            .get(`/locations/${mockLocation._id.toString()}/ratings/${mockRating._id.toString()}`);
    
            expect(response.status).toBe(200);
            expect(response.body.user).toBe(mockUser._id.toString());
            expect(response.body.location).toBe(mockLocation._id.toString());
            expect(response.body.value).toBe(5);
            expect(response.body.text).toBe("test comment");
        });
    
        it("should return 404 if rating is not found", async () => {
            ratingService.getRatingById.mockRejectedValue(new Error("Rating not found."));
    
            const response = await request(app)
            .get(`/locations/${mockLocation._id.toString()}/ratings/${mockRating._id.toString()}`);
    
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Rating not found.");
        });
    
        it("should return 500 if unexpected error occurs", async () => {
            ratingService.getRatingById.mockRejectedValue(new Error("Database failure."));
    
            const response = await request(app)
            .get(`/locations/${mockLocation._id.toString()}/ratings/${mockRating._id.toString()}`);
    
            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Internal server error: Database failure.");
        });
    });

    describe("DELETE /locations/:locationId/ratings/:id", () => {
        it("should return 204 no content if rating is deleted", async () => {
            ratingService.deleteRatingById.mockResolvedValue();
    
            const response = await request(app)
            .delete(`/locations/${mockLocation._id.toString()}/ratings/${mockRating._id.toString()}`);
    
            expect(response.status).toBe(204);
        });
    
        it("should return 404 if rating is not found", async () => {
            ratingService.deleteRatingById.mockRejectedValue(new Error("Rating not found."));
    
            const response = await request(app)
            .delete(`/locations/${mockLocation._id.toString()}/ratings/${mockRating._id.toString()}`);
    
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Rating not found.");
        });
    
        it("should return 500 if unexpected error occurs", async () => {
            ratingService.deleteRatingById.mockRejectedValue(new Error("Database failure."));
    
            const response = await request(app)
            .delete(`/locations/${mockLocation._id.toString()}/ratings/${mockRating._id.toString()}`);
    
            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Internal server error: Database failure.");
        });
    });
});