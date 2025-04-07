const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const locationController = require("../controllers/locationController");
const locationService = require("../services/locationService");
const app = require("../config/app");

app.use(express.json());
app.post("/", locationController.createLocation);
app.get("/:id", locationController.getLocationById);
app.get("/", locationController.getAllLocations);
app.put("/:id", locationController.updateLocation);
app.delete("/:id", locationController.deleteLocation);

jest.mock("../services/locationService");

describe ("Location Routes", () => {
    let mockLocation;

    beforeAll(() => {
        jest.setTimeout(10000);

        mockLocation = {
            _id: new mongoose.Types.ObjectId(),
            name: "testLocation",
            address: "0000 test address",
            city: "testCity"
        };

        mockLocation1 = {
            _id: new mongoose.Types.ObjectId(),
            name: "testLocation1",
            address: "1111 test address",
            city: "testCity1"
        }
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    describe("POST /locations/", () => {
        it ("should return 201 and create a new location", async () => {
            locationService.createLocation.mockResolvedValue(mockLocation);

            const response = await request(app)
            .post("/locations")
            .send({
                name: "testLocation",
                address: "0000 test address",
                city: "testCity"
            });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("_id");
            expect(response.body.name).toBe("testLocation");
            expect(response.body.address).toBe("0000 test address");
            expect(response.body.city).toBe("testCity");
        });

        it ("should return 409 if location already exists", async () => {
            locationService.createLocation.mockRejectedValue(new Error("Location already exists."));

            const response = await request(app)
            .post("/locations")
            .send({
                name: "testLocation",
                address: "0000 test address",
                city: "testCity"
            });

            expect(response.status).toBe(409);
            expect(response.body.message).toBe("Location already exists.");
        });

        it ("should return 500 if unexpected error occurs", async () => {
            locationService.createLocation.mockRejectedValue(new Error("Database failure."));

            const response = await request(app)
            .post("/locations")
            .send({
                name: "testLocation",
                address: "0000 test address",
                city: "testCity"
            });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Internal server error: Database failure.");
        });
    });

    describe("GET /locations/:id", () => {
        it ("should return 200 and a location by its Id", async () => {
            locationService.getLocationById.mockResolvedValue(mockLocation);

            const response = await request(app)
            .get(`/locations/${mockLocation._id.toString()}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("_id");
            expect(response.body.name).toBe("testLocation");
            expect(response.body.address).toBe("0000 test address");
            expect(response.body.city).toBe("testCity");
        });

        it ("should return 404 if location is not found", async () => {
            locationService.getLocationById.mockRejectedValue(new Error("Location not found."));

            const response = await request(app)
            .get(`/locations/${mockLocation._id.toString()}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Location not found.");
        });

        it ("should return 500 if unexpected error occurs", async () => {
            locationService.getLocationById.mockRejectedValue(new Error("Database failure."));

            const response = await request(app)
            .get(`/locations/${mockLocation._id.toString()}`);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Internal server error: Database failure.");
        });
    });

    describe("GET /locations/", () => {
        it ("should return 200 and all locations", async () => {
            const mockLocations = [
                { ...mockLocation, _id: mockLocation._id.toString() },
                { ...mockLocation1, _id: mockLocation1._id.toString() }
            ];
            locationService.getAllLocations.mockResolvedValue(mockLocations);

            const response = await request(app)
            .get("/locations");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockLocations);
        });

        it ("should return 500 if unexpected error occurs", async () => {
            locationService.getAllLocations.mockRejectedValue(new Error("Database failure."));

            const response = await request(app)
            .get("/locations");

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Internal server error: Database failure.");
        });
    });

    describe("PUT /locations/:id", () => {
        it ("should return 200 and an updated location", async () => {
            const updatedLocation = {
                name: "updatedLocation",
                address: "9999 updated location",
                city: "updatedCity",
                state: "updatedState"
            };
            locationService.updateLocation.mockResolvedValue({
                ...mockLocation,
                ...updatedLocation
            });

            const response = await request(app)
            .put(`/locations/${mockLocation._id.toString()}`)
            .send(updatedLocation);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("_id");
            expect(response.body.name).toBe("updatedLocation");
            expect(response.body.address).toBe("9999 updated location");
            expect(response.body.city).toBe("updatedCity");
            expect(response.body).toHaveProperty("state");
            expect(response.body.state).toBe("updatedState");
        });

        it ("should return 404 if location not found", async () => {
            const updatedLocation = {
                name: "updatedLocation",
                address: "9999 updated location",
                city: "updatedCity",
                state: "updatedState"
            };
            locationService.updateLocation.mockRejectedValue(new Error("Location not found."));

            const response = await request(app)
            .put(`/locations/${mockLocation._id.toString()}`)
            .send(updatedLocation);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Location not found.");
        });

        it ("should return 500 if unexpected error occurs", async () => {
            const updatedLocation = {
                name: "updatedLocation",
                address: "9999 updated location",
                city: "updatedCity",
                state: "updatedState"
            };
            locationService.updateLocation.mockRejectedValue(new Error("Database failure."));

            const response = await request(app)
            .put(`/locations/${mockLocation._id.toString()}`)
            .send(updatedLocation);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Internal server error: Database failure.");
        });
    });

    describe("DELETE /locations/:id", () => {
        it ("should return 204 if deletion is successful", async () => {
            locationService.deleteLocation.mockResolvedValue(undefined);
            locationService.getLocationById.mockRejectedValue(new Error("Location not found."));

            const response = await request(app)
            .delete(`/locations/${mockLocation._id.toString()}`);

            expect(response.status).toBe(204);
            expect(response.body).toEqual({});
        });

        it ("should return 404 if locations is not found", async () => {
            locationService.deleteLocation.mockRejectedValue(new Error("Location not found."));

            const response = await request(app)
            .delete(`/locations/${mockLocation._id.toString()}`);

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Location not found.");
        });

        it ("should return 500 if unexpected error occurs", async () => {
            locationService.deleteLocation.mockRejectedValue(new Error("Database failure."));

            const response = await request(app)
            .delete(`/locations/${mockLocation._id.toString()}`);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Internal server error: Database failure.");
        });
    });
});