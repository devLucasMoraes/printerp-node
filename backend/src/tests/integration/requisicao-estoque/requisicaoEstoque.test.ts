import request from "supertest";
import app from "../../../app";
import { Categoria } from "../../../domain/entities/Categoria";
import { Equipamento } from "../../../domain/entities/Equipamento";
import { Insumo } from "../../../domain/entities/Insumo";
import { Requisitante } from "../../../domain/entities/Requisitante";
import { Unidade } from "../../../domain/entities/Unidade";
import { User } from "../../../domain/entities/User";
import {
  categoriaRepository,
  equipamentoRepository,
  insumoRepository,
  requisicaoEstoqueRepository,
  requisitanteRepository,
  userRepository,
} from "../../../domain/repositories";

describe("RequisicaoEstoque Routes", () => {
  let cookies: string[] = [];
  let requisicaoEstoqueId: number;
  let testUser: User;
  let testRequisitante: Requisitante;
  let testEquipamento: Equipamento;
  let testInsumo: Insumo;
  let testCategoria: Categoria;

  beforeAll(async () => {
    // Create test user for authentication
    testUser = userRepository.create({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
      role: "admin",
    });
    await testUser.hashPassword();
    await userRepository.save(testUser);

    // Create test categoria
    testCategoria = categoriaRepository.create({
      nome: "Test Categoria",
    });
    await categoriaRepository.save(testCategoria);

    // Create test insumo
    testInsumo = insumoRepository.create({
      descricao: "Test Insumo",
      valorUntMed: 10.5,
      valorUntMedAuto: false,
      undEstoque: Unidade.KG,
      estoqueMinimo: 5,
      categoria: testCategoria,
    });
    await insumoRepository.save(testInsumo);

    // Create test requisitante
    testRequisitante = requisitanteRepository.create({
      nome: "Test Requisitante",
      fone: "123456789",
    });
    await requisitanteRepository.save(testRequisitante);

    // Create test equipamento
    testEquipamento = equipamentoRepository.create({
      nome: "Test Equipamento",
    });
    await equipamentoRepository.save(testEquipamento);

    // Login to get authentication cookies
    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "123456" });

    const setCookies = loginResponse.headers["set-cookie"];
    cookies = Array.isArray(setCookies) ? setCookies : [setCookies as string];

    // Create a test requisicaoEstoque
    const requisicaoEstoque = requisicaoEstoqueRepository.create({
      dataRequisicao: new Date().toISOString(),
      ordemProducao: "OP001",
      valorTotal: 100.5,
      obs: "Test observation",
      requisitante: testRequisitante,
      equipamento: testEquipamento,
      itens: [
        {
          quantidade: 2,
          undEstoque: Unidade.KG,
          valorUnitario: 50.25,
          insumo: testInsumo,
        },
      ],
    });
    const savedRequisicao = await requisicaoEstoqueRepository.save(
      requisicaoEstoque
    );

    console.log("savedRequisicao - ", savedRequisicao);
    requisicaoEstoqueId = savedRequisicao.id;
  });

  afterAll(async () => {
    // Cleanup
    //await requisicaoEstoqueRepository.delete(requisicaoEstoqueId);
    //await insumoRepository.delete(testInsumo.id);
    //await categoriaRepository.delete(testCategoria.id);
    //await requisitanteRepository.delete(testRequisitante.id);
    //await equipamentoRepository.delete(testEquipamento.id);
    //await userRepository.delete(testUser.id);
  });

  describe("GET /api/v1/requisicaoEstoques", () => {
    it("should not get requisicaoEstoques without authentication", async () => {
      const response = await request(app).get("/api/v1/requisicaoEstoques");
      expect(response.status).toBe(401);
    });

    it("should get list of requisicaoEstoques with pagination", async () => {
      const response = await request(app)
        .get("/api/v1/requisicaoEstoques")
        .set("Cookie", cookies)
        .query({ page: 1, size: 10 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.content)).toBe(true);
      expect(response.body).toHaveProperty("totalPages");
      expect(response.body).toHaveProperty("totalElements");
      expect(response.body).toHaveProperty("number");
    });

    it("should get all requisicaoEstoques without pagination", async () => {
      const response = await request(app)
        .get("/api/v1/requisicaoEstoques-all")
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/v1/requisicaoEstoques/:id", () => {
    it("should not get requisicaoEstoque without authentication", async () => {
      const response = await request(app).get(
        `/api/v1/requisicaoEstoques/${requisicaoEstoqueId}`
      );
      expect(response.status).toBe(401);
    });

    it("should get requisicaoEstoque by id with valid authentication", async () => {
      const response = await request(app)
        .get(`/api/v1/requisicaoEstoques/${requisicaoEstoqueId}`)
        .set("Cookie", cookies);

      console.log(
        "should get requisicaoEstoque by id with valid authentication - ",
        response.body
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", requisicaoEstoqueId);
      expect(response.body).toHaveProperty("ordemProducao", "OP001");
      expect(response.body).toHaveProperty("valorTotal", "100.5");
      expect(response.body).toHaveProperty("obs", "Test observation");
      expect(response.body.requisitante).toHaveProperty(
        "id",
        testRequisitante.id
      );
      expect(response.body.equipamento).toHaveProperty(
        "id",
        testEquipamento.id
      );
      expect(Array.isArray(response.body.itens)).toBe(true);
      expect(response.body.itens[0]).toHaveProperty("quantidade", "2");
      expect(response.body.itens[0]).toHaveProperty("valorUnitario", "50.25");
    });

    it("should return 404 for non-existent requisicaoEstoque", async () => {
      const response = await request(app)
        .get("/api/v1/requisicaoEstoques/9999")
        .set("Cookie", cookies);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "message",
        "RequisicaoEstoque not found"
      );
    });
  });

  describe("POST /api/v1/requisicaoEstoques", () => {
    it("should not create requisicaoEstoque without authentication", async () => {
      const response = await request(app)
        .post("/api/v1/requisicaoEstoques")
        .send({
          dataRequisicao: new Date().toISOString(),
          ordemProducao: "OP002",
          valorTotal: 150.75,
          obs: "New requisicao",
          requisitante: { id: testRequisitante.id },
          equipamento: { id: testEquipamento.id },
          itens: [
            {
              quantidade: 3,
              undEstoque: Unidade.KG,
              valorUnitario: 50.25,
              insumo: { id: testInsumo.id },
            },
          ],
        });

      expect(response.status).toBe(401);
    });

    it("should create new requisicaoEstoque with valid data", async () => {
      const response = await request(app)
        .post("/api/v1/requisicaoEstoques")
        .set("Cookie", cookies)
        .send({
          dataRequisicao: new Date(),
          ordemProducao: "OP002",
          valorTotal: 150.75,
          obs: "New requisicao",
          requisitante: { id: testRequisitante.id },
          equipamento: { id: testEquipamento.id },
          itens: [
            {
              quantidade: 3,
              undEstoque: Unidade.KG,
              valorUnitario: 50.25,
              insumo: { id: testInsumo.id },
            },
          ],
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("ordemProducao", "OP002");
      expect(response.body).toHaveProperty("valorTotal", "150.75");
      expect(response.body.requisitante).toHaveProperty(
        "id",
        testRequisitante.id
      );
      expect(response.body.equipamento).toHaveProperty(
        "id",
        testEquipamento.id
      );
      expect(response.body.itens).toHaveLength(1);

      // Cleanup
      if (response.body.id) {
        await requisicaoEstoqueRepository.delete(response.body.id);
      }
    });
  });

  describe("PUT /api/v1/requisicaoEstoques/:id", () => {
    it("should update requisicaoEstoque successfully", async () => {
      const response = await request(app)
        .put(`/api/v1/requisicaoEstoques/${requisicaoEstoqueId}`)
        .set("Cookie", cookies)
        .send({
          dataRequisicao: new Date(),
          ordemProducao: "OP003",
          valorTotal: 200.0,
          obs: "Updated requisicao",
          requisitante: { id: testRequisitante.id },
          equipamento: { id: testEquipamento.id },
          itens: [
            {
              quantidade: 4,
              undEstoque: Unidade.KG,
              valorUnitario: 50.0,
              insumo: { id: testInsumo.id },
            },
          ],
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("ordemProducao", "OP003");
      expect(response.body).toHaveProperty("valorTotal", "200.00");
      expect(response.body).toHaveProperty("obs", "Updated requisicao");
    });

    it("should return 404 when updating non-existent requisicaoEstoque", async () => {
      const response = await request(app)
        .put("/api/v1/requisicaoEstoques/9999")
        .set("Cookie", cookies)
        .send({
          dataRequisicao: new Date(),
          ordemProducao: "OP004",
          valorTotal: 250.0,
          obs: "Test update",
          requisitante: { id: testRequisitante.id },
          equipamento: { id: testEquipamento.id },
          itens: [
            {
              quantidade: 5,
              undEstoque: Unidade.KG,
              valorUnitario: 50.0,
              insumo: { id: testInsumo.id },
            },
          ],
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "message",
        "RequisicaoEstoque not found"
      );
    });
  });

  describe("DELETE /api/v1/requisicaoEstoques/:id", () => {
    it("should not delete requisicaoEstoque without authentication", async () => {
      const response = await request(app).delete(
        `/api/v1/requisicaoEstoques/${requisicaoEstoqueId}`
      );
      expect(response.status).toBe(401);
    });

    it("should delete requisicaoEstoque successfully", async () => {
      // First create a requisicaoEstoque to delete
      const createResponse = await request(app)
        .post("/api/v1/requisicaoEstoques")
        .set("Cookie", cookies)
        .send({
          dataRequisicao: new Date(),
          ordemProducao: "OP005",
          valorTotal: 300.0,
          obs: "To be deleted",
          requisitante: { id: testRequisitante.id },
          equipamento: { id: testEquipamento.id },
          itens: [
            {
              quantidade: 6,
              undEstoque: Unidade.KG,
              valorUnitario: 50.0,
              insumo: { id: testInsumo.id },
            },
          ],
        });

      const deleteResponse = await request(app)
        .delete(`/api/v1/requisicaoEstoques/${createResponse.body.id}`)
        .set("Cookie", cookies);

      expect(deleteResponse.status).toBe(204);

      // Verify deletion
      const getResponse = await request(app)
        .get(`/api/v1/requisicaoEstoques/${createResponse.body.id}`)
        .set("Cookie", cookies);

      expect(getResponse.status).toBe(404);
    });

    it("should return 404 when deleting non-existent requisicaoEstoque", async () => {
      const response = await request(app)
        .delete("/api/v1/requisicaoEstoques/9999")
        .set("Cookie", cookies);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "message",
        "RequisicaoEstoque not found"
      );
    });
  });
});
