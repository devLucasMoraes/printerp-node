import request from "supertest";
import app from "../../../app";
import { User } from "../../../domain/entities/User";
import {
  equipamentoRepository,
  userRepository,
} from "../../../domain/repositories";

describe("Equipamento Routes", () => {
  let cookies: string[] = [];
  let equipamentoId: number;
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

    // Create a test equipamento
    const equipamento = equipamentoRepository.create({
      nome: "Test Equipamento",
    });
    const savedEquipamento = await equipamentoRepository.save(equipamento);
    equipamentoId = savedEquipamento.id;
  });

  afterAll(async () => {
    // Cleanup
    await equipamentoRepository.delete(equipamentoId);
    await userRepository.delete(testUser.id);
  });

  describe("GET /api/v1/equipamentos", () => {
    it("should not get equipamentos without authentication", async () => {
      const response = await request(app).get("/api/v1/equipamentos");
      expect(response.status).toBe(401);
    });

    it("should get list of equipamentos with pagination", async () => {
      const response = await request(app)
        .get("/api/v1/equipamentos")
        .set("Cookie", cookies)
        .query({ page: 1, size: 10 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.content)).toBe(true);
      expect(response.body).toHaveProperty("totalPages");
      expect(response.body).toHaveProperty("totalElements");
      expect(response.body).toHaveProperty("number");
    });

    it("should get all equipamentos without pagination", async () => {
      const response = await request(app)
        .get("/api/v1/equipamentos-all")
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/v1/equipamentos/:id", () => {
    it("should not get equipamento without authentication", async () => {
      const response = await request(app).get(
        `/api/v1/equipamentos/${equipamentoId}`
      );
      expect(response.status).toBe(401);
    });

    it("should get equipamento by id with valid authentication", async () => {
      const response = await request(app)
        .get(`/api/v1/equipamentos/${equipamentoId}`)
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", equipamentoId);
      expect(response.body).toHaveProperty("nome", "Test Equipamento");
    });

    it("should return 404 for non-existent equipamento", async () => {
      const response = await request(app)
        .get("/api/v1/equipamentos/9999")
        .set("Cookie", cookies);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Equipamento not found");
    });
  });

  describe("POST /api/v1/equipamentos", () => {
    it("should not create equipamento without authentication", async () => {
      const response = await request(app).post("/api/v1/equipamentos").send({
        nome: "New Equipamento",
      });

      expect(response.status).toBe(401);
    });

    it("should create new equipamento with valid data", async () => {
      const response = await request(app)
        .post("/api/v1/equipamentos")
        .set("Cookie", cookies)
        .send({
          nome: "New Equipamento",
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("nome", "New Equipamento");

      // Cleanup
      if (response.body.id) {
        await equipamentoRepository.delete(response.body.id);
      }
    });

    it("should return 400 when nome already exists", async () => {
      const response = await request(app)
        .post("/api/v1/equipamentos")
        .set("Cookie", cookies)
        .send({
          nome: "Test Equipamento", // nome already exists
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Equipamento already exists"
      );
    });

    it("should return 400 when nome is too short", async () => {
      const response = await request(app)
        .post("/api/v1/equipamentos")
        .set("Cookie", cookies)
        .send({
          nome: "ab", // less than 3 characters
        });

      expect(response.status).toBe(400);
    });
  });

  describe("PUT /api/v1/equipamentos/:id", () => {
    it("should update equipamento successfully", async () => {
      const response = await request(app)
        .put(`/api/v1/equipamentos/${equipamentoId}`)
        .set("Cookie", cookies)
        .send({
          nome: "Updated Equipamento",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("nome", "Updated Equipamento");
    });

    it("should return 404 when updating non-existent equipamento", async () => {
      const response = await request(app)
        .put("/api/v1/equipamentos/9999")
        .set("Cookie", cookies)
        .send({
          nome: "Updated Equipamento",
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Equipamento not found");
    });

    it("should return 400 when updating with existing nome", async () => {
      // First create another equipamento
      const anotherEquipamento = await equipamentoRepository.save(
        equipamentoRepository.create({ nome: "Another Equipamento" })
      );

      const response = await request(app)
        .put(`/api/v1/equipamentos/${equipamentoId}`)
        .set("Cookie", cookies)
        .send({
          nome: "Another Equipamento", // This nome already exists
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Equipamento already exists"
      );

      // Cleanup
      await equipamentoRepository.delete(anotherEquipamento.id);
    });
  });

  describe("DELETE /api/v1/equipamentos/:id", () => {
    it("should not delete equipamento without authentication", async () => {
      const response = await request(app).delete(
        `/api/v1/equipamentos/${equipamentoId}`
      );
      expect(response.status).toBe(401);
    });

    it("should delete equipamento successfully", async () => {
      // First create an equipamento to delete
      const createResponse = await request(app)
        .post("/api/v1/equipamentos")
        .set("Cookie", cookies)
        .send({
          nome: "Equipamento to Delete",
        });

      const deleteResponse = await request(app)
        .delete(`/api/v1/equipamentos/${createResponse.body.id}`)
        .set("Cookie", cookies);
      expect(deleteResponse.status).toBe(204);

      // Verify deletion
      const getResponse = await request(app)
        .get(`/api/v1/equipamentos/${createResponse.body.id}`)
        .set("Cookie", cookies);

      expect(getResponse.status).toBe(404);
    });

    it("should return 404 when deleting non-existent equipamento", async () => {
      const response = await request(app)
        .delete("/api/v1/equipamentos/9999")
        .set("Cookie", cookies);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Equipamento not found");
    });
  });
});
