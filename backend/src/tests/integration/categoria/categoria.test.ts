import request from "supertest";
import app from "../../../app";
import { Categoria } from "../../../domain/entities/Categoria";
import { User } from "../../../domain/entities/User";
import {
  categoriaRepository,
  userRepository,
} from "../../../domain/repositories";

describe("CategoriaController", () => {
  let authCookies: string[] = [];
  let testCategoria: Categoria;
  let testUser: User;

  beforeAll(async () => {
    // Create test user for authentication
    testUser = userRepository.create({
      name: "Test User",
      email: "test@example.com",
      password: "test123",
      role: "admin",
    });

    await testUser.hashPassword();
    await userRepository.save(testUser);

    // Login to get authentication cookies
    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: "test@example.com",
      password: "test123",
    });

    const setCookies = loginResponse.headers["set-cookie"];
    authCookies = Array.isArray(setCookies)
      ? setCookies
      : [setCookies as string];

    // Create a test category
    testCategoria = categoriaRepository.create({
      nome: "Test Category",
    });

    await categoriaRepository.save(testCategoria);
  });

  afterAll(async () => {
    // Clean up test data
    await categoriaRepository.delete(testCategoria.id);
    await userRepository.delete(testUser.id);
  });

  describe("GET /api/v1/categorias", () => {
    it("should not list categories without authentication", async () => {
      const response = await request(app).get("/api/v1/categorias");
      expect(response.status).toBe(401);
    });

    it("should list categories with pagination when authenticated", async () => {
      const response = await request(app)
        .get("/api/v1/categorias")
        .set("Cookie", authCookies)
        .query({ page: 0, size: 10 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.content)).toBe(true);
      expect(response.body).toHaveProperty("totalPages");
      expect(response.body).toHaveProperty("totalElements");
      expect(response.body).toHaveProperty("number");
    });

    it("should get all categories without pagination", async () => {
      const response = await request(app)
        .get("/api/v1/categorias-all")
        .set("Cookie", authCookies);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /api/v1/categorias/:id", () => {
    it("should not get category without authentication", async () => {
      const response = await request(app).get(
        `/api/v1/categorias/${testCategoria.id}`
      );
      expect(response.status).toBe(401);
    });

    it("should get category by id when authenticated", async () => {
      const response = await request(app)
        .get(`/api/v1/categorias/${testCategoria.id}`)
        .set("Cookie", authCookies);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", testCategoria.id);
      expect(response.body).toHaveProperty("nome", testCategoria.nome);
    });

    it("should return 404 for non-existent category", async () => {
      const response = await request(app)
        .get("/api/v1/categorias/99999")
        .set("Cookie", authCookies);

      expect(response.status).toBe(404);
    });
  });

  describe("POST /api/v1/categorias", () => {
    it("should not create category without authentication", async () => {
      const response = await request(app).post("/api/v1/categorias").send({
        nome: "New Category",
      });

      expect(response.status).toBe(401);
    });

    it("should create new category when authenticated", async () => {
      const response = await request(app)
        .post("/api/v1/categorias")
        .set("Cookie", authCookies)
        .send({
          nome: "New Test Category",
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("nome", "New Test Category");

      // Clean up
      if (response.body.id) {
        await categoriaRepository.delete(response.body.id);
      }
    });

    it("should validate category name length", async () => {
      const response = await request(app)
        .post("/api/v1/categorias")
        .set("Cookie", authCookies)
        .send({
          nome: "ab", // Too short, minimum is 3 characters
        });

      expect(response.status).toBe(400);
    });
  });

  describe("PUT /api/v1/categorias/:id", () => {
    it("should not update category without authentication", async () => {
      const response = await request(app)
        .put(`/api/v1/categorias/${testCategoria.id}`)
        .send({
          nome: "Updated Category",
        });

      expect(response.status).toBe(401);
    });

    it("should update category when authenticated", async () => {
      const response = await request(app)
        .put(`/api/v1/categorias/${testCategoria.id}`)
        .set("Cookie", authCookies)
        .send({
          nome: "Updated Test Category",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("nome", "Updated Test Category");
    });

    it("should return 404 when updating non-existent category", async () => {
      const response = await request(app)
        .put("/api/v1/categorias/99999")
        .set("Cookie", authCookies)
        .send({
          nome: "Updated Category",
        });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/v1/categorias/:id", () => {
    it("should not delete category without authentication", async () => {
      const response = await request(app).delete(
        `/api/v1/categorias/${testCategoria.id}`
      );
      expect(response.status).toBe(401);
    });

    it("should delete category when authenticated", async () => {
      const response = await request(app)
        .delete(`/api/v1/categorias/${testCategoria.id}`)
        .set("Cookie", authCookies);

      expect(response.status).toBe(204);

      // Verify deletion
      const verifyResponse = await request(app)
        .get(`/api/v1/categorias/${testCategoria.id}`)
        .set("Cookie", authCookies);

      expect(verifyResponse.status).toBe(404);
    });

    it("should return 404 when deleting non-existent category", async () => {
      const response = await request(app)
        .delete("/api/v1/categorias/99999")
        .set("Cookie", authCookies);

      expect(response.status).toBe(404);
    });
  });
});
