const Tag = require("../models/Tag");

const createTag = async (tagData) => {
    const { tagName, tagCatagory } = tagData;

    let tag = await Tag.findOne({ tagName });
    if (tag) throw new Error ("Tag already exists.");

    tag = new Tag(tagData);
    return await tag.save();
};

const getTagById = async (tagId) => {
    return await Tag.findById(tagId);
};

const getTagByName = async (tagName) => {
    return await Tag.findOne(tagName);
}

const getPredefinedTags = async () => {
    return await Tag.find({ isPredefined: true });
};

const getAllTags = async () => {
    return await Tag.find({ });
};

const deleteTag = async (tagId) => {
    return await Tag.findByIdAndDelete(tagId);
};

module.exports = {
    createTag, getTagById, getTagByName, getPredefinedTags, getAllTags, deleteTag
};