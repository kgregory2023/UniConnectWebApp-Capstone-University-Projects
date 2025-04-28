const mongoose = require("mongoose");
const Location = require("../models/Location");
const Rating = require("../models/Rating");
const locationService = require("../services/locationService");
const ratingService = require("../services/ratingService");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoLocationServer;

beforeAll (async () => {
    mongoLocationServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoLocationServer.getUri());
});

afterAll (async () => {
    await mongoose.disconnect();
    await mongoLocationServer.stop();
});

describe("Location Service", () => {
    afterEach (async () => {
        await Location.deleteMany();
    });

    it ("should create a new location", async () => {
        const locationData = {
            name: "testLocation",
            address: "0000 test address",
            city: "testCity"
        };

        const location = await locationService.createLocation(locationData);
        expect(location).toHaveProperty("_id");
        expect(location.name).toBe("testLocation");
        expect(location.address).toBe("0000 test address");
        expect(location.city).toBe("testCity");
    });

    it ("should return an error if location exists already", async () => {
        const locationData = {
            name: "testLocation",
            address: "0000 test address",
            city: "testCity"
        };

        await locationService.createLocation(locationData);

        await expect(locationService.createLocation(locationData)).rejects.toThrow("Location already exists.");
    });

    it ("should return a location by its Id", async () => {
        const locationData = {
            name: "testLocation",
            address: "0000 test address",
            city: "testCity"
        };
        const location = await locationService.createLocation(locationData);
        locationId = location.id;

        const locationDBEntry = await locationService.getLocationById(locationId);
        expect(locationDBEntry.id).toEqual(locationId);
        expect(locationDBEntry.name).toBe("testLocation");
        expect(locationDBEntry.address).toBe("0000 test address");
        expect(locationDBEntry.city).toBe("testCity");
    });

    it ("should return an error if location not found by Id", async () => {
        locationId = new mongoose.Types.ObjectId;

        await expect(locationService.getLocationById(locationId)).rejects.toThrow("Location not found.");
    });

    it ("should return all locations", async () => {
        const locationData0 = {
            name: "testLocation0",
            address: "0000 test address",
            city: "testCity0"
        };
        const locationData1 = {
            name: "testLocation1",
            address: "1111 test address",
            city: "testCity1"
        };
        await locationService.createLocation(locationData0);
        await locationService.createLocation(locationData1);

        const locations = await locationService.getAllLocations();

        expect(locations).toBeDefined();
        expect(locations).toHaveLength(2);
        expect(locations[0].name).toBe("testLocation0");
        expect(locations[0].address).toBe("0000 test address");
        expect(locations[0].city).toBe("testCity0");
        expect(locations[1].name).toBe("testLocation1");
        expect(locations[1].address).toBe("1111 test address");
        expect(locations[1].city).toBe("testCity1");
    });

    it ("should update a location with new information", async () => {
        const testLocationData = {
            name: "testLocation",
            address: "0000 test address",
            city: "testCity"
        };
        const location = await locationService.createLocation(testLocationData);
        locationId = location.id;
        const updateLocationData = {
            name: "updateLocation",
            address: "0000 update address",
            city: "updateCity",
            state: "testState"
        }

        const updateLocation = await locationService.updateLocation(locationId, updateLocationData);
        expect(updateLocation).toBeDefined();
        expect(updateLocation.name).toBe("updateLocation");
        expect(updateLocation.address).toBe("0000 update address");
        expect(updateLocation.city).toBe("updateCity");
        expect(updateLocation.state).toBe("testState");
    });

    it ("should return an error when updating if location isn't found", async () => {
        const locationId = new mongoose.Types.ObjectId;
        const updateData = {
            name: "nahitwon'twork"
        };

        await expect(locationService.updateLocation(locationId, updateData)).rejects.toThrow("Location not found.");
    });

    it ("should delete a location when found by Id", async () => {
        const locationData = {
            name: "testLocation",
            address: "0000 test address",
            city: "testCity"
        };
        const location = await locationService.createLocation(locationData);
        const locationId = location.id;

        await locationService.deleteLocation(locationId);
        await expect(locationService.getLocationById(locationId)).rejects.toThrow("Location not found.");
    });

    it ("should return an error when deleting if location isn't found", async () => {
        const locationId = new mongoose.Types.ObjectId;

        await expect(locationService.deleteLocation(locationId)).rejects.toThrow("Location not found.");
    });

    it ("should delete all ratings associated with a location when the location is deleted", async () => {
        const locationData = {
            name: "testLocation",
            address: "0000 test address",
            city: "testCity"
        };
        const location = await locationService.createLocation(locationData);
        const locationId = location.id;

        const userId = new mongoose.Types.ObjectId;
        const ratingData1 = {
            user: userId,
            location: locationId,
            value: 4,
            text: "First test rating"
        };
        const ratingData2 = {
            user: userId,
            location: locationId,
            value: 5,
            text: "Second test rating"
        };
        await ratingService.createRating(ratingData1);
        await ratingService.createRating(ratingData2);

        const ratingsBeforeDelete = await Rating.find({ location: locationId });
        expect(ratingsBeforeDelete).toHaveLength(2);

        await locationService.deleteLocation(locationId);
        await expect(locationService.getLocationById(locationId)).rejects.toThrow("Location not found.");

        const ratingsAfterDelete = await Rating.find({ location: locationId });
        expect(ratingsAfterDelete).toHaveLength(0);
    });
});