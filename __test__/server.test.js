const request = require("supertest"); // For testing requests
const nock = require("nock"); // Mocking library for HTTP requests

const app = require("../src/server/index");

describe("POST /api/geonames", () => {
    beforeEach(() => {
        nock("https://api.geonames.org/searchJSON")
            .get(/q=.+?&username=.+/)
            .reply(200, {
                geonames: [{ lat: 37.7749, lng: -122.4194 }],
            });
    });

    afterEach(() => {
        nock.cleanAll(); // Clean up any remaining mocks
    });

    test("responds with coordinates from GeoNames API", async () => {
        const city = "San Francisco";
        const response = await request(app)
            .post("/api/geonames")
            .send({ city });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("geonames");
        expect(response.body.geonames[0]).toHaveProperty("lat");
        expect(response.body.geonames[0]).toHaveProperty("lng");
    });

    test("handles errors from GeoNames API", async () => {
        nock("https://api.geonames.org/searchJSON")
            .get(/q=.+?&username=.+/)
            .reply(200, {
                totalResultsCount: 0,
                geonames: [],
            });

        const city = "NonexistentCity";
        const response = await request(app)
            .post("/api/geonames")
            .send({ city });

        expect(response.statusCode).toBe(200);
        expect(response.body.totalResultsCount).toBe(0);
        expect(response.body.geonames).toEqual([]);
    });
});
