const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Rating = require("../models/Rating");
const userService = require("../services/userService");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("User Service", () => {
    afterEach(async () => {
        await User.deleteMany();
    });

    it("shoould register a new user", async () => {
        const userData = {
            username: "testuser",
            email: "test@example.com",
            password: "Test@123"
        };

        const user = await userService.registerUser(userData);
        expect(user).toHaveProperty("_id");
        expect(user.username).toBe("testuser");
        expect(user.email).toBe("test@example.com");
    });

    it("should not allow duplicate email registration", async () => {
        const userData = {
            username: "testuser",
            email: "test@example.com",
            password: "Test@123"
        };

        await userService.registerUser(userData);

        await expect(userService.registerUser(userData)).rejects.toThrow("User already exists.");
    });

    it("should hash password before saving user", async () => {
        const userData = {
            username: "testuser",
            email: "test@example.com",
            password: "Test@123"
        };

        const user = await userService.registerUser(userData);
        const foundUser = await User.findOne({ email: userData.email });
        
        expect(foundUser).toBeDefined();
        expect(user.password).not.toBe("Test@123");
        expect(await bcrypt.compare("Test@123", foundUser.password)).toBe(true);
    });

    it("should validate user login and return JWT", async () => {
        const userData = {
            username: "testuser",
            email: "test@example.com",
            password: "Test@123"
        };

        await userService.registerUser(userData);
        const loginResponse = await userService.loginUser({ email: userData.email, password: "Test@123"});

        expect(loginResponse).toHaveProperty("token");
        expect(loginResponse.user.email).toBe(userData.email);
    });

    it("should reject login if user not found", async () => {
        await expect(userService.loginUser({ email: "nonexistant@example.com", password: "Test@123"})).rejects.toThrow("Invalid email.");
    });

    it("shoud reject login with incorrect password", async () => {
        const userData = {
            username: "testuser",
            email: "test@example.com",
            password: "Test@123"
        };

        await userService.registerUser(userData);

        await expect(userService.loginUser({ email: userData.email, password: "wrongpassword"})).rejects.toThrow("Invalid password.");
    });

    it("should return user profile with populated comments and ratings", async () => {
        const userData = {
            username: "testuser",
            email: "test@example.com",
            password: "Test@123"
        };
        const user = await userService.registerUser(userData);
        userId = user._id;

        const rating = await new Rating({
            user: userId,
            location: new mongoose.Types.ObjectId(),
            value: 5,
            text: "Great place!"
        }).save();
        ratingId = rating._id;

        user.ratings = [ratingId];
        await user.save();

        const profile = await userService.getUserProfile(userId);

        expect(profile).toBeDefined();
        expect(profile.ratings).toHaveLength(1);
        expect(profile.ratings[0].value).toBe(5);
        expect(profile.ratings[0].text).toBe("Great place!");
    });

    it("should return null if user does not exist", async () => {
        const nonExistantUserId = new mongoose.Types.ObjectId();
        const profile = await userService.getUserProfile(nonExistantUserId);

        expect(profile).toBeNull();
    });

    it("should update user profile data", async () => {
        const userData = {
            username: "testuser",
            email: "test@example.com",
            password: "Test@123"
        };

        const user = await userService.registerUser(userData);
        const userId = user._id;

        const updateData = {
            username: "updatedUser",
            age: 22
        };

        const updatedUser = await userService.updateUserProfile(userId, updateData);
        const userFromDb = await User.findById(userId);

        expect(userFromDb.username).toBe(updateData.username);
        expect(userFromDb.age).toBe(updateData.age);
        expect(updatedUser.username).toBe(updateData.username);
        expect(updatedUser.age).toBe(updateData.age);
    });

    it("should return null if the user does not exist", async () => {
        const nonExistantUserId = new mongoose.Types.ObjectId();
        const updateData = {
            username: "nonExistentUser"
        };

        const updatedUser = await userService.updateUserProfile(nonExistantUserId, updateData);
        
        expect(updatedUser).toBeNull();
    });

    it("should delete user profile", async () => {
        const userData = {
            username: "testuser",
            email: "test@example.com",
            password: "Test@123"
        };

        const user = await userService.registerUser(userData);
        const userId = user._id;

        const deletedUser = await userService.deleteUser(userId);

        const userFromDb = await User.findById(userId);
        expect(userFromDb).toBeNull();
        expect(deletedUser).toBeDefined();
        expect(deletedUser._id.toString()).toBe(userId.toString());
    });

    it("should return null if the user does not exist whhen trying to delete", async () => {
        const nonExistantUserId = new mongoose.Types.ObjectId();
        const deletedUser = await userService.deleteUser(nonExistantUserId);

        expect(deletedUser).toBeNull();
    });
});

const {
  validatePassword,
  hashPassword,
  comparePassword,
  generateToken
} = require("../../authService");

describe("Password Utility Functions", () => {
  const strongPassword = "StrongPass@123";
  const weakPassword = "123";

  it("should validate a strong password without throwing", () => {
    expect(() => validatePassword(strongPassword)).not.toThrow();
  });

  it("should throw an error for a weak password", () => {
    expect(() => validatePassword(weakPassword)).toThrow(
      "Password must be 8-15 characters and include uppercase, lowercase, number, and special character."
    );
  });

  it("should hash and compare passwords correctly", async () => {
    const hashed = await hashPassword(strongPassword);
    expect(hashed).not.toBe(strongPassword);
    expect(await comparePassword(strongPassword, hashed)).toBe(true);
    expect(await comparePassword("WrongPass123", hashed)).toBe(false);
  });

  it("should generate and verify JWT token", () => {
    const user = { _id: "abc123", username: "testuser" };
    const token = generateToken(user);
    const decoded = require("jsonwebtoken").verify(token, process.env.JWT_SECRET);
    expect(decoded).toHaveProperty("id", user._id);
  });
});