const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Tag = require("../models/Tag");
const Rating = require("../models/Rating");
const userService = require("../services/userService");
const { MongoMemoryServer } = require("mongodb-memory-server");
process.env.JWT_SECRET = 'testsecret';

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

        const newPass = "NewPass@123";
        const updateData = {
            username: "updatedUser",
            age: 22,
            password: newPass
        };

        const updatedUser = await userService.updateUserProfile(userId, updateData);
        const userFromDb = await User.findById(userId);

        expect(userFromDb.username).toBe(updateData.username);
        expect(userFromDb.age).toBe(updateData.age);
        expect(userFromDb.password).not.toBe(newPass);
        const isPassCorrect = await bcrypt.compare(newPass, userFromDb.password);
        expect(isPassCorrect).toBe(true);
    });

    it("should return null if the user does not exist", async () => {
        const nonExistantUserId = new mongoose.Types.ObjectId();
        const updateData = {
            username: "nonExistentUser"
        };

        const updatedUser = await userService.updateUserProfile(nonExistantUserId, updateData);
        
        expect(updatedUser).toBeNull();
    });

    it("should return an error if something goes wrong", async () => {
        const nonExistantUserId = new mongoose.Types.ObjectId();
        const updateData = {
            username: "nonExistentUser"
        };
        const mockError = new Error("Database failure.");
        jest.spyOn(User, 'findByIdAndUpdate').mockRejectedValueOnce(mockError);
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await expect(userService.updateUserProfile(userId, updateData)).rejects.toThrow("Database failure.");
        consoleErrorSpy.mockRestore();
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

    it("should add tags to user when all tagIds are valid", async () => {
        const userId = "someuserid123";
        const tagIds = ["tagid1", "tagid2"];
        jest.spyOn(Tag, 'find').mockResolvedValueOnce([
            { _id: "tagid1" },
            { _id: "tagid2" }
        ]);
    
        const mockUpdatedUser = { _id: userId, tags: tagIds };
        jest.spyOn(User, 'findByIdAndUpdate').mockReturnValueOnce({
            populate: jest.fn().mockResolvedValueOnce(mockUpdatedUser)
        });
    
        const result = await userService.addTagsToUser(userId, tagIds);
    
        expect(result.tags).toEqual(tagIds);
    });
    
    it("should throw an error if any tagId is invalid", async () => {
        const userId = "someuserid123";
        const tagIds = ["tagid1", "tagid2"];
    
        jest.spyOn(Tag, 'find').mockResolvedValueOnce([
            { _id: "tagid1" }
        ]);
    
        await expect(userService.addTagsToUser(userId, tagIds))
            .rejects.toThrow("One or more tags are invalid.");
    });
    
    it("should remove tags from user", async () => {
        const userId = "someuserid123";
        const tagIds = ["tagid1", "tagid2"];
        const mockUpdatedUser = { _id: userId, tags: [] };
        jest.spyOn(User, 'findByIdAndUpdate').mockReturnValueOnce({
            populate: jest.fn().mockResolvedValueOnce(mockUpdatedUser)
        });
    
        const result = await userService.removeTagsFromUser(userId, tagIds);
    
        expect(result.tags).toEqual([]);
    });
    
    it("should return random users excluding the current user", async () => {
        const userId = new mongoose.Types.ObjectId;
        const mockUsers = [
            { _id: new mongoose.Types.ObjectId },
            { _id: new mongoose.Types.ObjectId },
            { _id: new mongoose.Types.ObjectId }
        ];
        jest.spyOn(User, 'aggregate').mockResolvedValueOnce(mockUsers);
    
        const result = await userService.getSwipeUsers(userId, 3);
    
        expect(result.length).toBe(3);
        expect(result).toEqual(mockUsers);
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