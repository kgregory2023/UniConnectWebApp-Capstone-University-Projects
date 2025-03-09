const request = require("supertest");
const jwt = require('jsonwebtoken');
const express = require("express");
const mongoose = require("mongoose");
const userController = require("../controllers/userController");
const userService = require("../services/userService");
const app = express();

app.use(express.json());
app.post("/register", userController.registerUser);
app.post("/login", userController.loginUser);
app.get("/profile", userController.getUserProfile);
app.put("/profile", userController.updateUserProfile);
app.delete("/profile", userController.deleteUser);

jest.mock("../services/userService");

describe("User Controller", () => {
    it("should register a new user", async () => {
        const mockUser = {
            _id: new mongoose.Types.ObjectId(),
            username: "testuser",
            email: "test@example.com",
            password: "securepassword"
        };
        userService.registerUser.mockResolvedValue(mockUser);

        const response = await request(app)
        .post("/register")
        .send({
            username: "testuser",
            email: "test@example.com",
            password: "securepassword"
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("_id");
        expect(response.body.username).toBe("testuser");
        expect(response.body.email).toBe("test@example.com");
        expect(response.body).toHaveProperty("password");
    });

    it("should return an error if user already exists", async () => {
        userService.registerUser.mockRejectedValue(new Error("User already exists."));

        const response = await request(app)
        .post("/register")
        .send({
            username: "testuser",
            email: "test@example.com",
            password: "securepassword"
        });

        expect(response.status).toBe(412);
        expect(response.body.message).toBe("User already exists.");
    });

    it("should login user and return a token", async () => {
        const mockLoginResponse = {
            token: "mock-jwt-token",
            user: {
                _id: new mongoose.Types.ObjectId(),
                username: "testuser",
                email: "test@example.com",
                password: "securepassword"
            }
        };
        userService.loginUser.mockResolvedValue(mockLoginResponse);

        const response = await request(app)
        .post("/login")
        .send({email: "test@example.com", password: "securepassword" });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(response.body.user.email).toBe("test@example.com");
    });

    it("should return an error if login email is invalid", async () => {
        userService.loginUser.mockRejectedValue(new Error("Invalid email."));  

        const response = await request(app)
        .post("/login")
        .send({ email: "wrong@example.com", password: "securepassword" });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Invalid email.");
    });

    it("should return an error if login password is invalid", async () => {
        userService.loginUser.mockRejectedValue(new Error("Invalid password." ));

        const response = await request(app)
        .post("/login")
        .send({ email: "test@example.com", password: "wrongpassword" });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Invalid password.");
    }); 
});
