jest.mock("../../authMiddleware", () => (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }

  const decoded = require("jsonwebtoken").decode(token);
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized: Token decode failed" });
  }

  req.user = { id: decoded?.id, role: decoded?.role };
  next();
});

jest.mock("../../roleMiddleware", () => (allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
});

const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const locationController = require("../controllers/locationController");
const locationService = require("../services/locationService");
const app = require("../config/app");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const locationRoutes = require("../routes/locationsRoutes");
app.use("/locations", locationRoutes); 

const adminToken = jwt.sign({ id: "adminId", role: "admin" }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
const userToken = jwt.sign({ id: "userId", role: "user" }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });
app.use(express.json());





jest.mock("../services/locationService");
const mockLocation = {
    _id: new mongoose.Types.ObjectId(),
    name: "testLocation",
    address: "0000 test address",
    city: "testCity"
  };
  
  const mockLocation1 = {
    _id: new mongoose.Types.ObjectId(),
    name: "testLocation1",
    address: "1111 test address",
    city: "testCity1"
  };


describe ("Location Routes", () => {

      beforeAll(() => {
        jest.setTimeout(10000)
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    describe("POST /locations/create (Role Protected)", () => {
        it("should allow admin to create a location", async () => {
          locationService.createLocation.mockResolvedValue(mockLocation);
      
          const response = await request(app)
            .post("/locations/create")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
              name: "testLocation",
              address: "0000 test address",
              city: "testCity",
            });
      
          expect(response.status).toBe(201);
          expect(response.body).toHaveProperty("_id");
          expect(response.body.name).toBe("testLocation");
          expect(response.body.address).toBe("0000 test address");
          expect(response.body.city).toBe("testCity");
        });
      
        it("should deny access for non-admin users", async () => {
          const response = await request(app)
            .post("/locations/create")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
              name: "Unauthorized Location",
              address: "456 User Ave",
              city: "Usertown",
            });
      
          expect(response.status).toBe(403);
          expect(response.body.message).toBe("Access denied");
        });
      
        it("should deny access if no token is provided", async () => {
          const response = await request(app)
            .post("/locations/create")
            .send({
              name: "No Auth Location",
              address: "0000 Unknown",
              city: "Nowhere",
            });
      
          expect(response.status).toBe(401);
        });
      
        it("should return 409 if location already exists", async () => {
          locationService.createLocation.mockRejectedValue(new Error("Location already exists."));
      
          const response = await request(app)
            .post("/locations/create")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
              name: "testLocation",
              address: "0000 test address",
              city: "testCity",
            });
      
          expect(response.status).toBe(409);
          expect(response.body.message).toBe("Location already exists.");
        });
      
        it("should return 500 if unexpected error occurs", async () => {
          locationService.createLocation.mockRejectedValue(new Error("Database failure."));
      
          const response = await request(app)
            .post("/locations/create")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
              name: "testLocation",
              address: "0000 test address",
              city: "testCity",
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
              .delete(`/locations/${mockLocation._id.toString()}`)
              .set("Authorization", `Bearer ${adminToken}`); 
  
          expect(response.status).toBe(204);
          expect(response.body).toEqual({});
      });
  
      it ("should return 404 if locations is not found", async () => {
          locationService.deleteLocation.mockRejectedValue(new Error("Location not found."));
  
          const response = await request(app)
              .delete(`/locations/${mockLocation._id.toString()}`)
              .set("Authorization", `Bearer ${adminToken}`); 
  
          expect(response.status).toBe(404);
          expect(response.body.message).toBe("Location not found.");
      });
  
      it ("should return 500 if unexpected error occurs", async () => {
          locationService.deleteLocation.mockRejectedValue(new Error("Database failure."));
  
          const response = await request(app)
              .delete(`/locations/${mockLocation._id.toString()}`)
              .set("Authorization", `Bearer ${adminToken}`); 
  
          expect(response.status).toBe(500);
          expect(response.body.message).toBe("Internal server error: Database failure.");
      });
  });
  
});
