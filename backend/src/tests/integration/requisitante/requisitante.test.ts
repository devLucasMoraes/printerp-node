import request from "supertest";
import app from "../../../app";
import { User } from "../../../domain/entities/User";
import {
  requisitanteRepository,
  userRepository,
} from "../../../domain/repositories";

describe("Requisitante Routes", () => {
  let cookies: string[] = [];
  let requisitanteId: number;
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

    // Create a test requisitante
    const requisitante = requisitanteRepository.create({
      nome: "Test Requisitante",
      fone: "123456789",
    });
    const savedRequisitante = await requisitanteRepository.save(requisitante);
    requisitanteId = savedRequisitante.id;
  });

  afterAll(async () => {
    // Cleanup
    await requisitanteRepository.delete(requisitanteId);
    await userRepository.delete(testUser.id);
  });

  describe("GET /api/v1/requisitantes", () => {
    it("should not get requisitantes without authentication", async () => {
      const response = await request(app).get("/api/v1/requisitantes");
      expect(response.status).toBe(401);
    });

    it("should get list of requisitantes with pagination", async () => {
      const response = await request(app)
        .get("/api/v1/requisitantes")
        .set("Cookie", cookies)
        .query({ page: 1, size: 10 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.content)).toBe(true);
      expect(response.body).toHaveProperty("totalPages");
      expect(response.body).toHaveProperty("totalElements");
      expect(response.body).toHaveProperty("number");
    });

    it("should get all requisitantes without pagination", async () => {
      const response = await request(app)
        .get("/api/v1/requisitantes-all")
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/v1/requisitantes/:id", () => {
    it("should not get requisitante without authentication", async () => {
      const response = await request(app).get(
        `/api/v1/requisitantes/${requisitanteId}`
      );
      expect(response.status).toBe(401);
    });

    it("should get requisitante by id with valid authentication", async () => {
      const response = await request(app)
        .get(`/api/v1/requisitantes/${requisitanteId}`)
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", requisitanteId);
      expect(response.body).toHaveProperty("nome", "Test Requisitante");
      expect(response.body).toHaveProperty("fone", "123456789");
    });

    it("should return 404 for non-existent requisitante", async () => {
      const response = await request(app)
        .get("/api/v1/requisitantes/9999")
        .set("Cookie", cookies);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "message",
        "Requisitante não encontrado"
      );
    });
  });

  describe("POST /api/v1/requisitantes", () => {
    it("should not create requisitante without authentication", async () => {
      const response = await request(app).post("/api/v1/requisitantes").send({
        nome: "New Requisitante",
        fone: "987654321",
      });

      expect(response.status).toBe(401);
    });

    it("should create new requisitante with valid data", async () => {
      const response = await request(app)
        .post("/api/v1/requisitantes")
        .set("Cookie", cookies)
        .send({
          nome: "New Requisitante",
          fone: "987654321",
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("nome", "New Requisitante");
      expect(response.body).toHaveProperty("fone", "987654321");

      // Cleanup
      if (response.body.id) {
        await requisitanteRepository.delete(response.body.id);
      }
    });

    it("should return 400 when nome already exists", async () => {
      const response = await request(app)
        .post("/api/v1/requisitantes")
        .set("Cookie", cookies)
        .send({
          nome: "Test Requisitante", // nome already exists
          fone: "987654321",
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("PUT /api/v1/requisitantes/:id", () => {
    it("should update requisitante successfully", async () => {
      const response = await request(app)
        .put(`/api/v1/requisitantes/${requisitanteId}`)
        .set("Cookie", cookies)
        .send({
          id: requisitanteId,
          nome: "Updated Requisitante",
          fone: "999999999",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("nome", "Updated Requisitante");
      expect(response.body).toHaveProperty("fone", "999999999");
    });

    it("should return 404 when updating non-existent requisitante", async () => {
      const response = await request(app)
        .put("/api/v1/requisitantes/9999")
        .set("Cookie", cookies)
        .send({
          id: 9999,
          nome: "Updated Requisitante",
          fone: "999999999",
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "message",
        "Requisitante não encontrado"
      );
    });
  });

  describe("DELETE /api/v1/requisitantes/:id", () => {
    it("should not delete requisitante without authentication", async () => {
      const response = await request(app).delete(
        `/api/v1/requisitantes/${requisitanteId}`
      );
      expect(response.status).toBe(401);
    });

    it("should delete requisitante successfully", async () => {
      // First create a requisitante to delete
      const createResponse = await request(app)
        .post("/api/v1/requisitantes")
        .set("Cookie", cookies)
        .send({
          nome: "Requisitante to Delete",
          fone: "123123123",
        });

      const deleteResponse = await request(app)
        .delete(`/api/v1/requisitantes/${createResponse.body.id}`)
        .set("Cookie", cookies);

      expect(deleteResponse.status).toBe(204);

      // Verify deletion
      const getResponse = await request(app)
        .get(`/api/v1/requisitantes/${createResponse.body.id}`)
        .set("Cookie", cookies);

      expect(getResponse.status).toBe(404);
    });

    it("should return 404 when deleting non-existent requisitante", async () => {
      const response = await request(app)
        .delete("/api/v1/requisitantes/9999")
        .set("Cookie", cookies);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "message",
        "Requisitante não encontrado"
      );
    });
  });
});
