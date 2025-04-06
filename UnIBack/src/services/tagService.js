const Tag = require("../models/Tag");

const createTag = async (tagData) => {
    const { name, category } = tagData;

    let tag = await Tag.findOne({ name });
    if (tag) throw new Error ("Tag already exists.");

    tag = new Tag(tagData);
    return await tag.save();
};

const getTagById = async (tagId) => {
    return await Tag.findById({ _id: tagId });
};

const getTagByName = async (tagName) => {
    return await Tag.findOne({ name: tagName });
}

const getPredefinedTags = async () => {
    return await Tag.find({ isPredefined: true });
};

const getAllTags = async () => {
    return await Tag.find();
};

const deleteTag = async (tagId) => {
    return await Tag.findByIdAndDelete({ _id:tagId });
};

module.exports = {
    createTag, getTagById, getTagByName, getPredefinedTags, getAllTags, deleteTag
};