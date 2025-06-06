const request = require("supertest");
const jwt = require('jsonwebtoken');
const express = require("express");
const mongoose = require("mongoose");
const userController = require("../controllers/userController");
const userService = require("../services/userService");
const app = require("../config/app");

app.use(express.json());
app.post("/register", userController.registerUser);
app.post("/login", userController.loginUser);
app.get("/profile", userController.getUserProfile);
app.put("/profile", userController.updateUserProfile);
app.delete("/profile", userController.deleteUser);

jest.mock("../services/userService");

describe("User Routes", () => {
    let mockToken;
    let mockUser;

    beforeAll(() => {
        jest.setTimeout(10000);
        process.env.JWT_SECRET = "test-secret";

        mockUser = {
            _id: new mongoose.Types.ObjectId(),
            username: "testuser",
            email: "test@example.com",
            password: "securepassword"
        };

        mockToken = jwt.sign({ _id: mockUser._id }, "test-secret", { expiresIn: "1h" });

        jest.spyOn(jwt, "verify").mockImplementation((token, secret) => {
            if(secret === "test-secret") return {_id: mockUser._id };
            throw new Error("Invalid token.");
        });
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    describe("POST /register", () => {
        it("should register a new user", async () => {
            userService.registerUser.mockResolvedValue(mockUser);
    
            const response = await request(app)
            .post("/users/register")
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
            .post("/users/register")
            .send({
                username: "testuser",
                email: "test@example.com",
                password: "securepassword"
            });
    
            expect(response.status).toBe(409);
            expect(response.body.message).toBe("User already exists.");
        });
    
        it("should return an error if unexpected server error occurs", async () => {
            userService.registerUser.mockRejectedValue(new Error("Database Failure"));
    
            const response = await request(app)
            .post("/users/register")
            .send({
                username: "testuser",
                email: "test@example.com",
                password: "securepassword"
            });
    
            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Internal server error: Database Failure");
        });
    });

    describe("POST /login", () => {
        it("should login user and return a token", async () => {
            const mockLoginResponse = {
                token: mockToken,
                user: mockUser
            };
            userService.loginUser.mockResolvedValue(mockLoginResponse);
    
            const response = await request(app)
            .post("/users/login")
            .send({email: "test@example.com", password: "securepassword" });
    
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("token");
            expect(response.body.user.email).toBe("test@example.com");
        });

        it("should return an error if login email is invalid", async () => {
            userService.loginUser.mockRejectedValue(new Error("Invalid email."));  
    
            const response = await request(app)
            .post("/users/login")
            .send({ email: "wrong@example.com", password: "securepassword" });
    
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Invalid email.");
        });
    
        it("should return an error if login password is invalid", async () => {
            userService.loginUser.mockRejectedValue(new Error("Invalid password." ));
    
            const response = await request(app)
            .post("/users/login")
            .send({ email: "test@example.com", password: "wrongpassword" });
    
            expect(response.status).toBe(401);
            expect(response.body.message).toBe("Invalid password.");
        });
    
        it("should return an error if unexpected server error occurs", async () => {
            userService.loginUser.mockRejectedValue(new Error("Database Failure"));
    
            const response = await request(app)
            .post("/users/login")
            .send({ email: "test@example.com", password: "wrongpassword" });
    
            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Internal server error: Database Failure");
        });
    });

    describe("GET /profile", () => {
        it("should return a user profile", async () => {
            const mockProfile = {
                ...mockUser,
                comments: [],
                ratings: []
            };
            userService.getUserProfile.mockResolvedValue(mockProfile);
    
            const response = await request(app)
            .get("/users/profile")
            .set("Authorization", `Bearer ${mockToken}`);
    
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("comments");
            expect(response.body).toHaveProperty("ratings");
            expect(response.body.username).toBe("testuser");
            expect(response.body.email).toBe("test@example.com");
        });
    
        it("should return an error if user profile doesn't exist", async () => {
            const nonExistantUserId = new mongoose.Types.ObjectId();
            const nonExistentToken = jwt.sign({ _id: nonExistantUserId }, "test-secret", { expiresIn: "1h" });
            userService.getUserProfile.mockRejectedValue(null);
    
            const response = await request(app)
            .get("/users/profile")
            .set("Authorization", `Bearer ${nonExistentToken}`);
    
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("User profile not found.");
        });
    });

    describe("PUT /profile", () => {
        it("should return the updated user profile after updated data added", async () => {
            const mockProfile = {
                ...mockUser,
                age: 20,
                comments: [],
                ratings: []
            };
            const updateData = {
                username: "updatedUser",
                age: 22
            };
            userService.updateUserProfile.mockResolvedValue({
                ...mockProfile,
                ...updateData
            });
    
            const response = await request(app)
            .put("/users/profile")
            .set("Authorization", `Bearer ${mockToken}`)
            .send(updateData);
    
            expect(response.status).toBe(200);
            expect(response.body.username).toBe("updatedUser");
            expect(response.body.age).toBe(22);
        });
        
        it("should return an error if user profile doesn't exist", async () => {
            const nonExistantUserId = new mongoose.Types.ObjectId();
            const nonExistentToken = jwt.sign({ _id: nonExistantUserId }, "test-secret", { expiresIn: "1h" });
            const updateData = {
                username: "updatedUser",
                age: 22
            };
            userService.updateUserProfile.mockRejectedValue(new Error("User profile not found."));
    
            const response = await request(app)
            .put("/users/profile")
            .set("Authorization", `Bearer ${nonExistentToken}`)
            .send(updateData);
    
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("User profile not found.");
        });
    });

    describe("DELETE /profile", () => {
        it("should delete a user profile when profile exists", async () => {
            const mockProfile = {
                ...mockUser,
                comments: [],
                ratings: []
            };
            userService.deleteUser.mockResolvedValue(undefined);
    
            const response = await request(app)
            .delete("/users/profile")
            .set("Authorization", `Bearer ${mockToken}`);
    
            expect(response.status).toBe(204);
            expect(response.body).toEqual({});
        });
    
        
        it("should return an error if user profile doesn't exist", async () => {
            const nonExistantUserId = new mongoose.Types.ObjectId();
            const nonExistentToken = jwt.sign({ _id: nonExistantUserId }, "test-secret", { expiresIn: "1h" });
            userService.deleteUser.mockRejectedValue(null);
    
            const response = await request(app)
            .delete("/users/profile")
            .set("Authorization", `Bearer ${nonExistentToken}`);
    
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("User profile not found.");
        });
    });
    
    const userService = require("../services/userService");
    const userRoutes = require("../routes/usersRoutes");
    const userController = require("../controllers/userController");
    const app = express();

    app.use(express.json());
    app.use("/users", userRoutes);
    mockToken = jwt.sign({ id: "123user" }, "test-secret", { expiresIn: "1h" });

    jest.mock("../services/userService");

// Defines a fake auth middleware 
const fakeAuth = (req, res, next) => {
    req.user = { id: "123user" };
    next();
};

// Hooks into the swipe route
app.get("/users/swipe/:count", fakeAuth, userController.getSwipeUsers);

describe("GET /users/swipe/:count", () => {
    it("should return a list of random users", async () => {
        const fakeUsers = [
            { _id: "1", username: "user1", age: 20, bio: "Bio 1", profilePic: "pic1.png" },
            { _id: "2", username: "user2", age: 22, bio: "Bio 2", profilePic: "pic2.png" },
            { _id: "3", username: "user3", age: 23, bio: "Bio 3", profilePic: "pic3.png" },
            { _id: "4", username: "user4", age: 24, bio: "Bio 4", profilePic: "pic4.png" },
            { _id: "5", username: "user5", age: 25, bio: "Bio 5", profilePic: "pic5.png" },
            
        ];

        userService.getSwipeUsers.mockResolvedValue(fakeUsers);

        const response = await request(app)
            .get("/users/swipe/5")
            .set("Authorization", `Bearer ${mockToken}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(5);
        expect(response.body[0]).toHaveProperty("username");
    });

    it("should return 500 on service failure", async () => {
        userService.getSwipeUsers.mockRejectedValue(new Error("DB Error"));

        const response = await request(app)
            .get("/users/swipe/5")
            .set("Authorization", `Bearer ${mockToken}`);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Failed to fetch users");
        });
    });
});