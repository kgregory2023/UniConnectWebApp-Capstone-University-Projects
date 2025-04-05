const mongoose = require("mongoose");
const Tag = require("../models/Tag");
const tagService = require("../services/tagService");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoTagServer;

beforeAll (async () => {
    mongoTagServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoTagServer.getUri());
});

afterAll (async () => {
    await mongoose.disconnect();
    await mongoTagServer.stop();
});

describe ("Tag Service", () => {
    afterEach (async () => {
        await Tag.deleteMany();
    });

    it ("should create a new tag", async () => {
        const tagData = {
            name: "test",
            category: "Testing",
        };

        const tag = await tagService.createTag(tagData);
        expect(tag).toHaveProperty("_id");
        expect(tag.name).toBe("test");
        expect(tag.category).toBe("Testing");
    });

    it ("should not allow duplicate tag creation", async () => {
        const tagData = {
            name: "test",
            category: "Testing",
        };
        await tagService.createTag(tagData);

        await expect(tagService.createTag(tagData)).rejects.toThrow("Tag already exists.");
    });

    it ("should get a tag by its id", async () => {
        const tagData = {
            name: "test",
            category: "Testing",
        };
        const tag = await tagService.createTag(tagData);
        tagId = tag.id;

        const tagDBEntry = await tagService.getTagById(tagId);
        expect(tagDBEntry).toBeDefined();
        expect(tagDBEntry.name).toBe("test");
        expect(tagDBEntry.category).toBe("Testing");
    });

    it ("should return null if tag is not found by its id", async () => {
        const nullTag = await tagService.getTagById(new mongoose.Types.ObjectId);
        expect(nullTag).toBeNull();
    });

    it ("should get a tag by its name", async () => {
        const tagData = {
            name: "test",
            category: "Testing",
        };
        await tagService.createTag(tagData);

        const tagDBEntry = await tagService.getTagByName("test");
        expect(tagDBEntry).toBeDefined();
        expect(tagDBEntry.name).toBe("test");
        expect(tagDBEntry.category).toBe("Testing");
    });

    it ("should return null if tag is not found by its name", async () => {
        const nullTag = await tagService.getTagByName("nulltag");
        expect(nullTag).toBeNull();
    });

    it ("should get all pre-defined tags", async () => {
        const userTag = {
                name: "usertag1",
                category: "Testing",
            };

        const preTag1 = {
            name: "pretag1",
            category: "Testing",
            isPredefined: true,
        };
        const preTag2 = {
            name: "pretag2",
            category: "Testing",
            isPredefined: true,
        };

        await tagService.createTag(userTag); 
        await tagService.createTag(preTag1);
        await tagService.createTag(preTag2);

        const preTags = await tagService.getPredefinedTags();
        expect(preTags).toBeDefined();
        expect(preTags).toHaveLength(2);
        expect(preTags[0].name).toBe("pretag1");
        expect(preTags[1].name).toBe("pretag2");
        expect(preTags[0].category).toBe("Testing");
        expect(preTags[1].category).toBe("Testing");
    });

    it ("should get all tags in db", async () => {
        const tagData1 = {
            name: "test1",
            category: "Testing",
        };
        const tagData2 = {
            name: "test2",
            category: "Testing",
            isPredefined: true,
        };

        await tagService.createTag(tagData1);
        await tagService.createTag(tagData2);

        const tags = await tagService.getAllTags();
        expect(tags).toBeDefined();
        expect(tags).toHaveLength(2);
        expect(tags[0].name).toBe("test1");
        expect(tags[1].name).toBe("test2");
        expect(tags[0].category).toBe("Testing");
        expect(tags[1].category).toBe("Testing");
    });

    it ("should delete a tag", async () => {
        const tagData = {
            name: "test",
            category: "Testing",
        };
        const tag = await tagService.createTag(tagData);
        tagId = tag.id;

        const deletedTag = await tagService.deleteTag(tagId);
        const delTag = await tagService.getTagById(tagId);

        expect(delTag).toBeNull();
        expect(deletedTag).toBeDefined();
    });
});