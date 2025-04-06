const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");

jest.mock("../services/tagService");
const tagService = require("../services/tagService");
const tagController = require("../controllers/tagController");

const app = require("../config/app");
app.use(express.json());
app.post("/profile/tags", tagController.createTag);
app.get("/profile/tags/:id", tagController.getTagById);
app.get("/profile/tags/predefined", tagController.getPredefinedTags);
app.get("/profile/tags", tagController.getAllTags);
app.delete("/profile/tags/:id", tagController.deleteTag);

describe("Tag Routes", () => {
    let mockUser;
    let mockAdmin;
    let mockTag;
    let mockPreTag1;
    let mockPreTag2;

    beforeAll(() => {
            jest.clearAllMocks();
            jest.setTimeout(10000);

            mockTag = {
                _id: new mongoose.Types.ObjectId(),
                name: "testtag",
                category: "testing",
                isPredefined: false
            };

            mockPreTag1 = {
                _id: new mongoose.Types.ObjectId(),
                name: "testpretag1",
                category: "testing",
                isPredefined: true
            };

            mockPreTag2 = {
                _id: new mongoose.Types.ObjectId(),
                name: "testpretag2",
                category: "testing",
                isPredefined: true
            };
    
            mockUser = {
                _id: new mongoose.Types.ObjectId(),
                username: "testuser",
                email: "test@example.com",
                password: "securepassword"
            };

            mockAdmin = {
                _id: new mongoose.Types.ObjectId(),
                username: "testuser",
                email: "test@example.com",
                password: "securepassword",
                role: "admin"
            };
        });

        afterAll(() => {
            jest.restoreAllMocks();
        });

    describe("POST /profile/tags", () => {
        it("should allow creation of new tag", async () => {
            tagService.createTag.mockResolvedValue(mockTag);

            const response = await request(app)
            .post("/profile/tags")
            .send({
                name: "testtag",
                category: "testing"
            });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("_id");
            expect(response.body.name).toBe("testtag");
            expect(response.body.category).toBe("testing");
            expect(response.body).toHaveProperty("isPredefined");
        });

        it("should return an error if tag with same name exists", async () => {
            tagService.createTag.mockRejectedValue(new Error("Tag already exists."));

            const response = await request(app)
            .post("/profile/tags")
            .send({
                name: "testtag",
                category: "testing"
            });

            expect(response.status).toBe(409);
            expect(response.body.message).toBe("Tag already exists.");
        });

        it("should return an error if tag name is empty", async () => {
            tagService.createTag.mockRejectedValue(new Error("Tag name is required."));

            const response = await request(app)
            .post("/profile/tags")
            .send({
                category: "testing"
            });
            
            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Tag name is required.");
        });

        it("should return an error if tag category is empty", async () => {
            tagService.createTag.mockRejectedValue(new Error("Tag category is required."));

            const response = await request(app)
            .post("/profile/tags")
            .send({
                name: "testtag",
            });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Tag category is required.");
        });

        it("should return an error if unexpected error occurs", async () => {
            tagService.createTag.mockRejectedValue(new Error("Database failure."));

            const response = await request(app)
            .post("/profile/tags")
            .send({
                name: "testtag",
                category: "testing"
            });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Internal server error: Database failure.");
        });
    });

    describe("GET /profile/tags/:id", () => {
        it("should return a tag based on ID", async () => {
            tagService.getTagById.mockResolvedValue(mockTag);

            const response = await request(app)
            .get(`/profile/tags/${mockTag._id.toString()}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("_id");
            expect(response.body.name).toBe("testtag");
            expect(response.body.category).toBe("testing");
            expect(response.body).toHaveProperty("isPredefined");
        });

        it("should return an error if tag isn't found", async () => {
            tagService.getTagById.mockResolvedValue(null);

            const response = await request(app)
            .get(`/profile/tags/${mockTag._id.toString()}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Tag not found.");
        });

        it("should return an error if unexpected error occurs", async () => {
            tagService.getTagById.mockRejectedValue(new Error("Database failure."));

            const response = await request(app)
            .get(`/profile/tags/${mockTag._id.toString()}`);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Internal server error: Database failure.");
        });
    });

    describe("GET /profile/tags/predefined", () => {
        it("should return a list of predefined tags", async () => {
            const mockPreTags = [
                { ...mockPreTag1, _id: mockPreTag1._id.toString() },
                { ...mockPreTag2, _id: mockPreTag2._id.toString() }
            ];
            tagService.getPredefinedTags.mockImplementation(() => {
                console.log("Mock getPredefinedTags hit");
                return Promise.resolve(mockPreTags);
              });

            const response = await request(app)
            .get("/profile/tags/predefined");

            expect(response.body).toEqual(mockPreTags);
        });

        it("should return an error if unexpected error occurs", async () => {
            tagService.getPredefinedTags.mockRejectedValue(new Error("Database failure."));

            const response = await request(app)
            .get("/profile/tags/predefined");

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Internal server error: Database failure.");
        });
    });

    describe("GET /profile/tags", () => {
        it("should return a list of all tags", async () => {
            mockTags = [
                { ...mockTag, _id: mockTag._id.toString() },
                { ...mockPreTag1, _id: mockPreTag1._id.toString() },
                { ...mockPreTag2, _id: mockPreTag2._id.toString() }
            ];
            tagService.getAllTags.mockResolvedValue(mockTags);

            const response = await request(app)
            .get("/profile/tags");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTags);
        });

        it("should return an error if unexpected error occurs", async () => {
            tagService.getAllTags.mockRejectedValue(new Error("Database failure."));

            const response = await request(app)
            .get("/profile/tags");

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Internal server error: Database failure.");
        });
    });

    describe("DELETE /profile/tags/:id", () => {
        it("should allow a tag to be deleted if user is admin", async () => {
            
        });

        it("should return an error if tag isn't found", async () => {

        });

        it("should return an error if user isn't an admin", async () => {

        });

        it("should return an error if unexpected error occurs", async () => {

        });
    });
});