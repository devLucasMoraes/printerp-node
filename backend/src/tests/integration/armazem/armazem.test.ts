import request from "supertest";
import app from "../../../app";
import { User } from "../../../domain/entities/User";
import {
  armazemRepository,
  userRepository,
} from "../../../domain/repositories";

describe("Armazem Routes", () => {
  let cookies: string[] = [];
  let armazemId: number;
  let testUser: User;

  beforeAll(async () => {
    // Create a test user for authentication
    testUser = userRepository.create({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
      role: "admin",
    });
    await testUser.hashPassword();
    await userRepository.save(testUser);

    // Login to get authentication cookies
    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "123456" });

    const setCookies = loginResponse.headers["set-cookie"];
    cookies = Array.isArray(setCookies) ? setCookies : [setCookies as string];

    // Create a test armazem
    const armazem = armazemRepository.create({
      nome: "Test Armazem",
      ativo: true,
    });
    const savedArmazem = await armazemRepository.save(armazem);
    armazemId = savedArmazem.id;
  });

  afterAll(async () => {
    // Cleanup
    await armazemRepository.delete(armazemId);
    await userRepository.delete(testUser.id);
  });

  describe("GET /api/v1/armazens", () => {
    it("should not get armazens without authentication", async () => {
      const response = await request(app).get("/api/v1/armazens");
      expect(response.status).toBe(401);
    });

    it("should get list of armazens with pagination", async () => {
      const response = await request(app)
        .get("/api/v1/armazens")
        .set("Cookie", cookies)
        .query({ page: 1, size: 10 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.content)).toBe(true);
      expect(response.body).toHaveProperty("totalPages");
      expect(response.body).toHaveProperty("totalElements");
      expect(response.body).toHaveProperty("number");
    });

    it("should get all armazens without pagination", async () => {
      const response = await request(app)
        .get("/api/v1/armazens-all")
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/v1/armazens/:id", () => {
    it("should not get armazem without authentication", async () => {
      const response = await request(app).get(`/api/v1/armazens/${armazemId}`);
      expect(response.status).toBe(401);
    });

    it("should get armazem by id with valid authentication", async () => {
      const response = await request(app)
        .get(`/api/v1/armazens/${armazemId}`)
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", armazemId);
      expect(response.body).toHaveProperty("nome", "Test Armazem");
      expect(response.body).toHaveProperty("ativo", true);
    });

    it("should return 404 for non-existent armazem", async () => {
      const response = await request(app)
        .get("/api/v1/armazens/9999")
        .set("Cookie", cookies);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Armazém não encontrado");
    });
  });

  describe("POST /api/v1/armazens", () => {
    it("should not create armazem without authentication", async () => {
      const response = await request(app).post("/api/v1/armazens").send({
        nome: "New Armazem",
        ativo: true,
      });

      expect(response.status).toBe(401);
    });

    it("should create new armazem with valid data", async () => {
      const response = await request(app)
        .post("/api/v1/armazens")
        .set("Cookie", cookies)
        .send({
          nome: "New Armazem",
          ativo: true,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("nome", "New Armazem");
      expect(response.body).toHaveProperty("ativo", true);

      // Cleanup
      if (response.body.id) {
        await armazemRepository.delete(response.body.id);
      }
    });

    it("should return 400 when nome already exists", async () => {
      const response = await request(app)
        .post("/api/v1/armazens")
        .set("Cookie", cookies)
        .send({
          nome: "Test Armazem", // nome already exists
          ativo: true,
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("PUT /api/v1/armazens/:id", () => {
    it("should update armazem successfully", async () => {
      const response = await request(app)
        .put(`/api/v1/armazens/${armazemId}`)
        .set("Cookie", cookies)
        .send({
          id: armazemId,
          nome: "Updated Armazem",
          ativo: true,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("nome", "Updated Armazem");
      expect(response.body).toHaveProperty("ativo", true);
    });

    it("should return 404 when updating non-existent armazem", async () => {
      const response = await request(app)
        .put("/api/v1/armazens/9999")
        .set("Cookie", cookies)
        .send({
          id: 9999,
          nome: "Updated Armazem",
          ativo: true,
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Armazém não encontrado");
    });

    it("should return 400 when trying to change armazem id", async () => {
      const response = await request(app)
        .put(`/api/v1/armazens/${armazemId}`)
        .set("Cookie", cookies)
        .send({
          id: 9999, // Different from path parameter
          nome: "Updated Armazem",
          ativo: true,
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Id do armazém não pode ser alterado"
      );
    });

    it("should return 400 when trying to update with existing nome", async () => {
      // First create another armazem
      const anotherArmazem = await armazemRepository.save(
        armazemRepository.create({
          nome: "Another Armazem",
          ativo: true,
        })
      );

      const response = await request(app)
        .put(`/api/v1/armazens/${armazemId}`)
        .set("Cookie", cookies)
        .send({
          id: armazemId,
          nome: "Another Armazem", // This nome already exists
          ativo: true,
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");

      // Cleanup
      await armazemRepository.delete(anotherArmazem.id);
    });

    it("should return 400 when trying to update with existing nome of disable entity", async () => {
      // First create another armazem
      const anotherArmazem = await armazemRepository.save(
        armazemRepository.create({
          nome: "Another Armazem",
          ativo: true,
        })
      );

      anotherArmazem.ativo = false;

      await armazemRepository.save(anotherArmazem);

      await armazemRepository.softDelete(anotherArmazem.id);

      const response = await request(app)
        .put(`/api/v1/armazens/${armazemId}`)
        .set("Cookie", cookies)
        .send({
          id: armazemId,
          nome: "Another Armazem", // This nome already exists
          ativo: true,
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");

      // Cleanup
      await armazemRepository.delete(anotherArmazem.id);
    });
  });

  describe("DELETE /api/v1/armazens/:id", () => {
    it("should not delete armazem without authentication", async () => {
      const response = await request(app).delete(
        `/api/v1/armazens/${armazemId}`
      );
      expect(response.status).toBe(401);
    });

    it("should delete armazem successfully", async () => {
      // First create an armazem to delete
      const createResponse = await request(app)
        .post("/api/v1/armazens")
        .set("Cookie", cookies)
        .send({
          nome: "Armazem to Delete",
          ativo: true,
        });

      const deleteResponse = await request(app)
        .delete(`/api/v1/armazens/${createResponse.body.id}`)
        .set("Cookie", cookies);

      expect(deleteResponse.status).toBe(204);

      // Verify deletion
      const getResponse = await request(app)
        .get(`/api/v1/armazens/${createResponse.body.id}`)
        .set("Cookie", cookies);

      expect(getResponse.status).toBe(404);
    });

    it("should return 404 when deleting non-existent armazem", async () => {
      const response = await request(app)
        .delete("/api/v1/armazens/9999")
        .set("Cookie", cookies);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Armazém não encontrado");
    });
  });
});
