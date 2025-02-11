import request from "supertest";
import app from "../../../app";
import { Categoria } from "../../../domain/entities/Categoria";
import { Unidade } from "../../../domain/entities/Unidade";
import { User } from "../../../domain/entities/User";
import {
  categoriaRepository,
  insumoRepository,
  userRepository,
} from "../../../domain/repositories";

describe("Insumo Routes", () => {
  let cookies: string[] = [];
  let insumoId: number;
  let testUser: User;
  let testCategoria: Categoria;

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

    // Create a test categoria
    testCategoria = categoriaRepository.create({
      nome: "Test Categoria",
    });
    await categoriaRepository.save(testCategoria);

    // Login to get authentication cookies
    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "123456" });

    const setCookies = loginResponse.headers["set-cookie"];
    cookies = Array.isArray(setCookies) ? setCookies : [setCookies as string];

    // Create a test insumo
    const insumo = insumoRepository.create({
      descricao: "Test Insumo",
      valorUntMed: 10.5,
      valorUntMedAuto: false,
      undEstoque: Unidade.KG,
      estoqueMinimo: 5,
      categoria: testCategoria,
    });
    const savedInsumo = await insumoRepository.save(insumo);
    insumoId = savedInsumo.id;
  });

  afterAll(async () => {
    // Cleanup
    await insumoRepository.delete(insumoId);
    await categoriaRepository.delete(testCategoria.id);
    await userRepository.delete(testUser.id);
  });

  describe("GET /api/v1/insumos", () => {
    it("should not get insumos without authentication", async () => {
      const response = await request(app).get("/api/v1/insumos");
      expect(response.status).toBe(401);
    });

    it("should get list of insumos with pagination", async () => {
      const response = await request(app)
        .get("/api/v1/insumos")
        .set("Cookie", cookies)
        .query({ page: 1, size: 10 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.content)).toBe(true);
      expect(response.body).toHaveProperty("totalPages");
      expect(response.body).toHaveProperty("totalElements");
      expect(response.body).toHaveProperty("number");
    });

    it("should get all insumos without pagination", async () => {
      const response = await request(app)
        .get("/api/v1/insumos-all")
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/v1/insumos/:id", () => {
    it("should not get insumo without authentication", async () => {
      const response = await request(app).get(`/api/v1/insumos/${insumoId}`);
      expect(response.status).toBe(401);
    });

    it("should get insumo by id with valid authentication", async () => {
      const response = await request(app)
        .get(`/api/v1/insumos/${insumoId}`)
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", insumoId);
      expect(response.body).toHaveProperty("descricao", "Test Insumo");
      expect(response.body).toHaveProperty("valorUntMed", "10.5");
      expect(response.body).toHaveProperty("valorUntMedAuto", false);
      expect(response.body).toHaveProperty("undEstoque", Unidade.KG);
      expect(response.body).toHaveProperty("estoqueMinimo", "5");
    });

    it("should return 404 for non-existent insumo", async () => {
      const response = await request(app)
        .get("/api/v1/insumos/9999")
        .set("Cookie", cookies);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Insumo not found");
    });
  });

  describe("POST /api/v1/insumos", () => {
    it("should not create insumo without authentication", async () => {
      const response = await request(app)
        .post("/api/v1/insumos")
        .send({
          descricao: "New Insumo",
          valorUntMed: 15.75,
          valorUntMedAuto: true,
          undEstoque: Unidade.KG,
          estoqueMinimo: 10,
          categoria: { id: testCategoria.id },
        });

      expect(response.status).toBe(401);
    });

    it("should create new insumo with valid data", async () => {
      const response = await request(app)
        .post("/api/v1/insumos")
        .set("Cookie", cookies)
        .send({
          descricao: "New Insumo",
          valorUntMed: 15.75,
          valorUntMedAuto: true,
          undEstoque: Unidade.KG,
          estoqueMinimo: 10,
          categoria: { id: testCategoria.id },
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("descricao", "New Insumo");
      expect(response.body).toHaveProperty("valorUntMed", 15.75);
      expect(response.body).toHaveProperty("valorUntMedAuto", true);
      expect(response.body).toHaveProperty("undEstoque", Unidade.KG);
      expect(response.body).toHaveProperty("estoqueMinimo", 10);

      // Cleanup
      if (response.body.id) {
        await insumoRepository.delete(response.body.id);
      }
    });

    it("should return 400 when descricao already exists", async () => {
      const response = await request(app)
        .post("/api/v1/insumos")
        .set("Cookie", cookies)
        .send({
          descricao: "Test Insumo", // descricao already exists
          valorUntMed: 15.75,
          valorUntMedAuto: true,
          undEstoque: Unidade.KG,
          estoqueMinimo: 10,
          categoria: { id: testCategoria.id },
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Insumo already exists");
    });

    it("should return 400 when descricao is too short", async () => {
      const response = await request(app)
        .post("/api/v1/insumos")
        .set("Cookie", cookies)
        .send({
          descricao: "ab", // less than 3 characters
          valorUntMed: 15.75,
          valorUntMedAuto: true,
          undEstoque: Unidade.KG,
          estoqueMinimo: 10,
          categoria: { id: testCategoria.id },
        });

      expect(response.status).toBe(400);
    });
  });

  describe("PUT /api/v1/insumos/:id", () => {
    it("should update insumo successfully", async () => {
      const response = await request(app)
        .put(`/api/v1/insumos/${insumoId}`)
        .set("Cookie", cookies)
        .send({
          descricao: "Updated Insumo",
          valorUntMed: 20.5,
          valorUntMedAuto: true,
          undEstoque: Unidade.KG,
          estoqueMinimo: 15,
          categoria: { id: testCategoria.id },
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("descricao", "Updated Insumo");
      expect(response.body).toHaveProperty("valorUntMed", 20.5);
      expect(response.body).toHaveProperty("valorUntMedAuto", true);
      expect(response.body).toHaveProperty("estoqueMinimo", 15);
    });

    it("should return 404 when updating non-existent insumo", async () => {
      const response = await request(app)
        .put("/api/v1/insumos/9999")
        .set("Cookie", cookies)
        .send({
          descricao: "Updated Insumo",
          valorUntMed: 20.5,
          valorUntMedAuto: true,
          undEstoque: Unidade.KG,
          estoqueMinimo: 15,
          categoria: { id: testCategoria.id },
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Insumo not found");
    });

    it("should return 400 when updating with existing descricao", async () => {
      // First create another insumo
      const anotherInsumo = await insumoRepository.save(
        insumoRepository.create({
          descricao: "Another Insumo",
          valorUntMed: 25.0,
          valorUntMedAuto: false,
          undEstoque: Unidade.KG,
          estoqueMinimo: 20,
          categoria: testCategoria,
        })
      );

      const response = await request(app)
        .put(`/api/v1/insumos/${insumoId}`)
        .set("Cookie", cookies)
        .send({
          descricao: "Another Insumo", // This descricao already exists
          valorUntMed: 20.5,
          valorUntMedAuto: true,
          undEstoque: Unidade.KG,
          estoqueMinimo: 15,
          categoria: { id: testCategoria.id },
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Insumo already exists");

      // Cleanup
      await insumoRepository.delete(anotherInsumo.id);
    });
  });

  describe("DELETE /api/v1/insumos/:id", () => {
    it("should not delete insumo without authentication", async () => {
      const response = await request(app).delete(`/api/v1/insumos/${insumoId}`);
      expect(response.status).toBe(401);
    });

    it("should delete insumo successfully", async () => {
      // First create an insumo to delete
      const createResponse = await request(app)
        .post("/api/v1/insumos")
        .set("Cookie", cookies)
        .send({
          descricao: "Insumo to Delete",
          valorUntMed: 30.0,
          valorUntMedAuto: false,
          undEstoque: Unidade.KG,
          estoqueMinimo: 25,
          categoria: { id: testCategoria.id },
        });

      const deleteResponse = await request(app)
        .delete(`/api/v1/insumos/${createResponse.body.id}`)
        .set("Cookie", cookies);

      expect(deleteResponse.status).toBe(204);

      // Verify deletion
      const getResponse = await request(app)
        .get(`/api/v1/insumos/${createResponse.body.id}`)
        .set("Cookie", cookies);

      expect(getResponse.status).toBe(404);
    });

    it("should return 404 when deleting non-existent insumo", async () => {
      const response = await request(app)
        .delete("/api/v1/insumos/9999")
        .set("Cookie", cookies);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Insumo not found");
    });
  });
});
