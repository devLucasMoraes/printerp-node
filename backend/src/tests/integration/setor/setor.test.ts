import request from "supertest";
import app from "../../../app";
import { User } from "../../../domain/entities/User";
import { setorRepository, userRepository } from "../../../domain/repositories";

describe("Setor Routes", () => {
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

    // Create a test setor
    const setor = setorRepository.create({
      nome: "Test Setor",
    });
    const savedSetor = await setorRepository.save(setor);
    equipamentoId = savedSetor.id;
  });

  afterAll(async () => {
    // Cleanup
    await setorRepository.delete(equipamentoId);
    await userRepository.delete(testUser.id);
  });

  describe("GET /api/v1/setores", () => {
    it("should not get setores without authentication", async () => {
      const response = await request(app).get("/api/v1/setores");
      expect(response.status).toBe(401);
    });

    it("should get list of setores with pagination", async () => {
      const response = await request(app)
        .get("/api/v1/setores")
        .set("Cookie", cookies)
        .query({ page: 1, size: 10 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.content)).toBe(true);
      expect(response.body).toHaveProperty("totalPages");
      expect(response.body).toHaveProperty("totalElements");
      expect(response.body).toHaveProperty("number");
    });

    it("should get all setores without pagination", async () => {
      const response = await request(app)
        .get("/api/v1/setores-all")
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/v1/setores/:id", () => {
    it("should not get setor without authentication", async () => {
      const response = await request(app).get(
        `/api/v1/setores/${equipamentoId}`
      );
      expect(response.status).toBe(401);
    });

    it("should get setor by id with valid authentication", async () => {
      const response = await request(app)
        .get(`/api/v1/setores/${equipamentoId}`)
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", equipamentoId);
      expect(response.body).toHaveProperty("nome", "Test Setor");
    });

    it("should return 404 for non-existent setor", async () => {
      const response = await request(app)
        .get("/api/v1/setores/9999")
        .set("Cookie", cookies);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Setor não encontrado");
    });
  });

  describe("POST /api/v1/setores", () => {
    it("should not create setor without authentication", async () => {
      const response = await request(app).post("/api/v1/setores").send({
        nome: "New Setor",
      });

      expect(response.status).toBe(401);
    });

    it("should create new setor with valid data", async () => {
      const response = await request(app)
        .post("/api/v1/setores")
        .set("Cookie", cookies)
        .send({
          nome: "New Setor",
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("nome", "New Setor");

      // Cleanup
      if (response.body.id) {
        await setorRepository.delete(response.body.id);
      }
    });

    it("should return 400 when nome already exists", async () => {
      const response = await request(app)
        .post("/api/v1/setores")
        .set("Cookie", cookies)
        .send({
          nome: "Test Setor", // nome already exists
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });

    it("should return 400 when nome is too short", async () => {
      const response = await request(app)
        .post("/api/v1/setores")
        .set("Cookie", cookies)
        .send({
          nome: "ab", // less than 3 characters
        });

      expect(response.status).toBe(400);
    });
  });

  describe("PUT /api/v1/setores/:id", () => {
    it("should update setor successfully", async () => {
      const response = await request(app)
        .put(`/api/v1/setores/${equipamentoId}`)
        .set("Cookie", cookies)
        .send({
          id: equipamentoId,
          nome: "Updated Setor",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("nome", "Updated Setor");
    });

    it("should return 404 when updating non-existent setor", async () => {
      const response = await request(app)
        .put("/api/v1/setores/9999")
        .set("Cookie", cookies)
        .send({
          id: 9999,
          nome: "Updated Setor",
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Setor não encontrado");
    });

    it("should return 400 when updating with existing nome", async () => {
      // First create another setor
      const anotherSetor = await setorRepository.save(
        setorRepository.create({ nome: "Another Setor" })
      );

      const response = await request(app)
        .put(`/api/v1/setores/${equipamentoId}`)
        .set("Cookie", cookies)
        .send({
          id: equipamentoId,
          nome: "Another Setor", // This nome already exists
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");

      // Cleanup
      await setorRepository.delete(anotherSetor.id);
    });
  });

  describe("DELETE /api/v1/setores/:id", () => {
    it("should not delete setor without authentication", async () => {
      const response = await request(app).delete(
        `/api/v1/setores/${equipamentoId}`
      );
      expect(response.status).toBe(401);
    });

    it("should delete setor successfully", async () => {
      // First create an setor to delete
      const createResponse = await request(app)
        .post("/api/v1/setores")
        .set("Cookie", cookies)
        .send({
          nome: "Setor to Delete",
        });

      const deleteResponse = await request(app)
        .delete(`/api/v1/setores/${createResponse.body.id}`)
        .set("Cookie", cookies);
      expect(deleteResponse.status).toBe(204);

      // Verify deletion
      const getResponse = await request(app)
        .get(`/api/v1/setores/${createResponse.body.id}`)
        .set("Cookie", cookies);

      expect(getResponse.status).toBe(404);
    });

    it("should return 404 when deleting non-existent setor", async () => {
      const response = await request(app)
        .delete("/api/v1/setores/9999")
        .set("Cookie", cookies);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Setor não encontrado");
    });
  });
});
