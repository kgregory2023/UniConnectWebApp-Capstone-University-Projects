const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const userService = require("../services/userService");
const userController = require("../controllers/userController");
const app = express();

app.use(express.json());
const mockToken = jwt.sign({ id: "123user" }, "test-secret", { expiresIn: "1h" });

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
