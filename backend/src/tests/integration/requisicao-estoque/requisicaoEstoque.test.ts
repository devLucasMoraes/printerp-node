import request from "supertest";
import app from "../../../app";
import { Armazem } from "../../../domain/entities/Armazem";
import { Categoria } from "../../../domain/entities/Categoria";
import { Insumo } from "../../../domain/entities/Insumo";
import { RequisicaoEstoque } from "../../../domain/entities/RequisicaoEstoque";
import { RequisicaoEstoqueItem } from "../../../domain/entities/RequisicaoEstoqueItem";
import { Requisitante } from "../../../domain/entities/Requisitante";
import { Setor } from "../../../domain/entities/Setor";
import { Unidade } from "../../../domain/entities/Unidade";
import { User } from "../../../domain/entities/User";
import {
  armazemRepository,
  categoriaRepository,
  insumoRepository,
  requisicaoEstoqueRepository,
  requisitanteRepository,
  setorRepository,
  userRepository,
} from "../../../domain/repositories";

describe("RequisicaoEstoque Routes", () => {
  let cookies: string[] = [];
  let testUser: User;
  let testRequisitante: Requisitante;
  let testEquipamento: Setor;
  let testInsumo: Insumo;
  let testCategoria: Categoria;
  let testRequisicaoEstoque: RequisicaoEstoque;
  let testRequisicaoEstoqueItem: RequisicaoEstoqueItem;
  let testArmazem: Armazem;

  beforeAll(async () => {
    // Criar na ordem correta respeitando as dependências

    // 1. Criar usuário para autenticação
    testUser = userRepository.create({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
      role: "admin",
    });
    await testUser.hashPassword();
    await userRepository.save(testUser);

    // 2. Criar categoria (necessária para insumo)
    testCategoria = categoriaRepository.create({
      nome: "Test Categoria",
    });
    await categoriaRepository.save(testCategoria);
    expect(testCategoria.id).toBeDefined();

    // 3. Criar insumo
    testInsumo = insumoRepository.create({
      descricao: "Test Insumo",
      valorUntMed: 10.5,
      valorUntMedAuto: false,
      undEstoque: Unidade.KG,
      estoqueMinimo: 5,
      categoria: testCategoria,
    });
    await insumoRepository.save(testInsumo);
    expect(testInsumo.id).toBeDefined();

    // 4. Criar requisitante
    testRequisitante = requisitanteRepository.create({
      nome: "Test Requisitante",
      fone: "123456789",
    });
    await requisitanteRepository.save(testRequisitante);
    expect(testRequisitante.id).toBeDefined();

    // 5. Criar equipamento
    testEquipamento = setorRepository.create({
      nome: "Test Equipamento",
    });
    await setorRepository.save(testEquipamento);
    expect(testEquipamento.id).toBeDefined();

    // 6. Criar armazem
    testArmazem = armazemRepository.create({
      nome: "Test Armazem",
    });
    await armazemRepository.save(testArmazem);
    expect(testArmazem.id).toBeDefined();

    // 7. Fazer login e obter cookies
    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "123456" });

    expect(loginResponse.status).toBe(200);
    const setCookies = loginResponse.headers["set-cookie"];
    cookies = Array.isArray(setCookies) ? setCookies : [setCookies as string];
    expect(cookies.length).toBeGreaterThan(0);

    // 8. Criar requisição de estoque inicial com item
    testRequisicaoEstoque = requisicaoEstoqueRepository.create({
      dataRequisicao: new Date(),
      ordemProducao: "OP001",
      valorTotal: 100.5,
      obs: "Test observation",
      requisitante: testRequisitante,
      setor: testEquipamento,
      armazem: testArmazem,
      itens: [
        {
          quantidade: 2,
          unidade: Unidade.KG,
          valorUnitario: 50.25,
          insumo: testInsumo,
        },
      ],
    });

    await requisicaoEstoqueRepository.save(testRequisicaoEstoque);
    expect(testRequisicaoEstoque.id).toBeDefined();
    expect(testRequisicaoEstoque.itens.length).toBe(1);
    testRequisicaoEstoqueItem = testRequisicaoEstoque.itens[0];
    expect(testRequisicaoEstoqueItem.id).toBeDefined();
  });

  afterAll(async () => {
    // Limpar na ordem correta para evitar violação de chave estrangeira
    if (testRequisicaoEstoque?.id) {
      await requisicaoEstoqueRepository.softDelete(testRequisicaoEstoque.id);
      // Verificar se foi realmente deletado
      const deletedRequisicao = await requisicaoEstoqueRepository.findOne({
        where: { id: testRequisicaoEstoque.id },
        withDeleted: true,
      });
      expect(deletedRequisicao?.deletedAt).toBeDefined();
    }

    if (testInsumo?.id) {
      await insumoRepository.softDelete(testInsumo.id);
    }

    if (testCategoria?.id) {
      await categoriaRepository.softDelete(testCategoria.id);
    }

    if (testRequisitante?.id) {
      await requisitanteRepository.softDelete(testRequisitante.id);
    }

    if (testEquipamento?.id) {
      await setorRepository.softDelete(testEquipamento.id);
    }

    if (testArmazem?.id) {
      await armazemRepository.softDelete(testArmazem.id);
    }

    if (testUser?.id) {
      await userRepository.softDelete(testUser.id);
    }
  });

  describe("POST /api/v1/requisicoes-estoque", () => {
    it("should not create requisicaoEstoque without authentication", async () => {
      const response = await request(app)
        .post("/api/v1/requisicoes-estoque")
        .send({
          dataRequisicao: new Date().toISOString(),
          ordemProducao: "OP002",
          valorTotal: 150.75,
          obs: "New requisicao",
          requisitante: { id: testRequisitante.id },
          equipamento: { id: testEquipamento.id },
          armazem: { id: testArmazem.id },
          itens: [
            {
              id: null,
              quantidade: 3,
              unidade: Unidade.KG,
              valorUnitario: 50.25,
              insumo: { id: testInsumo.id },
            },
          ],
        });

      expect(response.status).toBe(401);
    });

    it("should not allow creating requisicaoEstoque with existing item ids", async () => {
      const response = await request(app)
        .post("/api/v1/requisicoes-estoque")
        .set("Cookie", cookies)
        .send({
          dataRequisicao: new Date().toISOString(),
          ordemProducao: "OP002",
          valorTotal: 150.75,
          obs: "New requisicao",
          requisitante: { id: testRequisitante.id },
          equipamento: { id: testEquipamento.id },
          armazem: { id: testArmazem.id },
          itens: [
            {
              id: testRequisicaoEstoqueItem.id, // Tentando usar ID existente
              quantidade: 3,
              unidade: Unidade.KG,
              valorUnitario: 50.25,
              insumo: { id: testInsumo.id },
            },
          ],
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "itens.0.id: Expected null, received number"
      );
    });

    it("should create new requisicaoEstoque with valid data", async () => {
      const newRequisicao = {
        dataRequisicao: new Date().toISOString(),
        ordemProducao: "OP002",
        valorTotal: 150.75,
        obs: "New requisicao",
        requisitante: { id: testRequisitante.id },
        equipamento: { id: testEquipamento.id },
        armazem: { id: testArmazem.id },
        itens: [
          {
            id: null,
            quantidade: 3,
            unidade: Unidade.KG,
            valorUnitario: 50.25,
            insumo: { id: testInsumo.id },
          },
        ],
      };

      const response = await request(app)
        .post("/api/v1/requisicoes-estoque")
        .set("Cookie", cookies)
        .send(newRequisicao);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.requisitante.id).toBe(testRequisitante.id);
      expect(response.body.equipamento.id).toBe(testEquipamento.id);
      expect(response.body.armazem.id).toBe(testArmazem.id);
      expect(response.body.itens).toHaveLength(1);
      expect(response.body.itens[0].id).toBeDefined();
      expect(response.body.itens[0].id).not.toBe(testRequisicaoEstoqueItem.id);
      expect(response.body.itens[0].insumo.id).toBe(testInsumo.id);

      // Cleanup
      if (response.body.id) {
        await requisicaoEstoqueRepository.softDelete(response.body.id);

        // Verificar se foi realmente deletado
        const deletedRequisicao = await requisicaoEstoqueRepository.findOne({
          where: { id: response.body.id },
          withDeleted: true,
        });
        expect(deletedRequisicao?.deletedAt).toBeDefined();
      }
    });

    it("should validate required fields", async () => {
      const response = await request(app)
        .post("/api/v1/requisicoes-estoque")
        .set("Cookie", cookies)
        .send({
          // Omitindo campos obrigatórios
          obs: "Invalid requisicao",
        });

      expect(response.status).toBe(400);
    });
  });
  describe("PUT /api/v1/requisicoes-estoque/:id", () => {
    let auxRequisicao: RequisicaoEstoque;

    // Criar uma requisição auxiliar para alguns testes
    beforeAll(async () => {
      auxRequisicao = await requisicaoEstoqueRepository.save(
        requisicaoEstoqueRepository.create({
          dataRequisicao: new Date(),
          ordemProducao: "OP_AUX",
          valorTotal: 100.0,
          obs: "Aux requisicao",
          requisitante: testRequisitante,
          setor: testEquipamento,
          armazem: { id: testArmazem.id },
          itens: [
            {
              quantidade: 1,
              unidade: Unidade.KG,
              valorUnitario: 100.0,
              insumo: testInsumo,
            },
          ],
        })
      );
      expect(auxRequisicao.id).toBeDefined();
      expect(auxRequisicao.itens[0].id).toBeDefined();
    });

    afterAll(async () => {
      if (auxRequisicao?.id) {
        await requisicaoEstoqueRepository.softDelete(auxRequisicao.id);
      }
    });

    it("should not update requisicaoEstoque without authentication", async () => {
      const response = await request(app)
        .put(`/api/v1/requisicoes-estoque/${testRequisicaoEstoque.id}`)
        .send({
          dataRequisicao: new Date().toISOString(),
          ordemProducao: "OP_UPDATE",
          valorTotal: 200.0,
          obs: "Updated requisicao",
          requisitante: { id: testRequisitante.id },
          equipamento: { id: testEquipamento.id },
          armazem: { id: testArmazem.id },
          itens: [
            {
              id: testRequisicaoEstoqueItem.id,
              quantidade: 4,
              unidade: Unidade.KG,
              valorUnitario: 50.0,
              insumo: { id: testInsumo.id },
            },
          ],
        });

      expect(response.status).toBe(401);
    });

    it("should update existing items if they belong to the requisicao", async () => {
      const updateData = {
        dataRequisicao: new Date().toISOString(),
        ordemProducao: "OP_UPDATE",
        valorTotal: 200.0,
        obs: "Updated requisicao",
        requisitante: { id: testRequisitante.id },
        equipamento: { id: testEquipamento.id },
        armazem: { id: testArmazem.id },
        itens: [
          {
            id: testRequisicaoEstoqueItem.id,
            quantidade: 4,
            unidade: Unidade.KG,
            valorUnitario: 50.0,
            insumo: { id: testInsumo.id },
          },
        ],
      };

      const response = await request(app)
        .put(`/api/v1/requisicoes-estoque/${testRequisicaoEstoque.id}`)
        .set("Cookie", cookies)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testRequisicaoEstoque.id);
      expect(response.body.ordemProducao).toBe("OP_UPDATE");
      expect(response.body.itens).toHaveLength(1);
      expect(response.body.itens[0].id).toBe(testRequisicaoEstoqueItem.id);
      expect(response.body.itens[0].quantidade).toBe(4);
    });

    it("should add new items when id is null", async () => {
      const updateData = {
        dataRequisicao: new Date().toISOString(),
        ordemProducao: "OP_NEW_ITEM",
        valorTotal: 250.0,
        obs: "Updated with new item",
        requisitante: { id: testRequisitante.id },
        equipamento: { id: testEquipamento.id },
        armazem: { id: testArmazem.id },
        itens: [
          {
            id: testRequisicaoEstoqueItem.id,
            quantidade: 4,
            unidade: Unidade.KG,
            valorUnitario: 50.0,
            insumo: { id: testInsumo.id },
          },
          {
            id: null,
            quantidade: 2,
            unidade: Unidade.KG,
            valorUnitario: 25.0,
            insumo: { id: testInsumo.id },
          },
        ],
      };

      const response = await request(app)
        .put(`/api/v1/requisicoes-estoque/${testRequisicaoEstoque.id}`)
        .set("Cookie", cookies)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.itens).toHaveLength(2);
      expect(response.body.itens[0].id).toBe(testRequisicaoEstoqueItem.id);
      expect(response.body.itens[1].id).toBeDefined();
      expect(response.body.itens[1].id).not.toBe(testRequisicaoEstoqueItem.id);
      expect(response.body.itens[1].quantidade).toBe(2);
    });

    it("should remove items not included in the update", async () => {
      // Primeiro criar uma requisição com dois itens
      const createResponse = await request(app)
        .post("/api/v1/requisicoes-estoque")
        .set("Cookie", cookies)
        .send({
          dataRequisicao: new Date().toISOString(),
          ordemProducao: "OP_REMOVE",
          valorTotal: 300.0,
          obs: "Two items",
          requisitante: { id: testRequisitante.id },
          equipamento: { id: testEquipamento.id },
          armazem: { id: testArmazem.id },
          itens: [
            {
              id: null,
              quantidade: 3,
              unidade: Unidade.KG,
              valorUnitario: 50.0,
              insumo: { id: testInsumo.id },
            },
            {
              id: null,
              quantidade: 2,
              unidade: Unidade.KG,
              valorUnitario: 75.0,
              insumo: { id: testInsumo.id },
            },
          ],
        });

      expect(createResponse.status).toBe(201);
      expect(createResponse.body.itens).toHaveLength(2);
      const firstItemId = createResponse.body.itens[0].id;
      expect(firstItemId).toBeDefined();

      // Atualizar mantendo apenas o primeiro item
      const updateResponse = await request(app)
        .put(`/api/v1/requisicoes-estoque/${createResponse.body.id}`)
        .set("Cookie", cookies)
        .send({
          dataRequisicao: new Date().toISOString(),
          ordemProducao: "OP_REMOVE",
          valorTotal: 150.0,
          obs: "One item removed",
          requisitante: { id: testRequisitante.id },
          equipamento: { id: testEquipamento.id },
          armazem: { id: testArmazem.id },
          itens: [
            {
              id: firstItemId,
              quantidade: 3,
              unidade: Unidade.KG,
              valorUnitario: 50.0,
              insumo: { id: testInsumo.id },
            },
          ],
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.itens).toHaveLength(1);
      expect(updateResponse.body.itens[0].id).toBe(firstItemId);

      // Cleanup
      await requisicaoEstoqueRepository.softDelete(createResponse.body.id);
    });

    it("should not update item if it belongs to another requisicao", async () => {
      const updateData = {
        dataRequisicao: new Date().toISOString(),
        ordemProducao: "OP_INVALID",
        valorTotal: 200.0,
        obs: "Try to use item from another requisicao",
        requisitante: { id: testRequisitante.id },
        equipamento: { id: testEquipamento.id },
        armazem: { id: testArmazem.id },
        itens: [
          {
            id: auxRequisicao.itens[0].id, // Item de outra requisição
            quantidade: 2,
            unidade: Unidade.KG,
            valorUnitario: 100.0,
            insumo: { id: testInsumo.id },
          },
        ],
      };

      const response = await request(app)
        .put(`/api/v1/requisicoes-estoque/${testRequisicaoEstoque.id}`)
        .set("Cookie", cookies)
        .send(updateData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Não é possível atualizar o item de outra requisição"
      );
    });

    it("should validate required fields in update", async () => {
      const response = await request(app)
        .put(`/api/v1/requisicoes-estoque/${testRequisicaoEstoque.id}`)
        .set("Cookie", cookies)
        .send({
          // Omitindo campos obrigatórios
          obs: "Invalid update",
        });

      expect(response.status).toBe(400);
    });

    it("should return 404 when updating non-existent requisicao", async () => {
      const response = await request(app)
        .put("/api/v1/requisicoes-estoque/9999999")
        .set("Cookie", cookies)
        .send({
          id: 9999999,
          dataRequisicao: new Date().toISOString(),
          ordemProducao: "OP_NOT_FOUND",
          valorTotal: 200.0,
          obs: "Non-existent requisicao",
          requisitante: { id: testRequisitante.id },
          equipamento: { id: testEquipamento.id },
          armazem: { id: testArmazem.id },
          itens: [
            {
              id: null,
              quantidade: 2,
              unidade: Unidade.KG,
              valorUnitario: 100.0,
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
  describe("GET /api/v1/requisicoes-estoque", () => {
    let additionalRequisicoes: RequisicaoEstoque[] = [];

    // Criar requisições adicionais para testar paginação
    beforeAll(async () => {
      const requisicoes = [];
      for (let i = 1; i <= 3; i++) {
        requisicoes.push(
          requisicaoEstoqueRepository.create({
            dataRequisicao: new Date(),
            ordemProducao: `OP_PAGE_${i}`,
            valorTotal: 100.0 * i,
            obs: `Requisicao page ${i}`,
            requisitante: testRequisitante,
            setor: testEquipamento,
            armazem: { id: testArmazem.id },
            itens: [
              {
                quantidade: i,
                unidade: Unidade.KG,
                valorUnitario: 100.0,
                insumo: testInsumo,
              },
            ],
          })
        );
      }
      additionalRequisicoes = await requisicaoEstoqueRepository.save(
        requisicoes
      );

      // Verificar se todas foram criadas corretamente
      expect(additionalRequisicoes).toHaveLength(3);
      additionalRequisicoes.forEach((req) => {
        expect(req.id).toBeDefined();
        expect(req.itens).toHaveLength(1);
        expect(req.itens[0].id).toBeDefined();
      });
    });

    afterAll(async () => {
      // Limpar requisições adicionais
      for (const req of additionalRequisicoes) {
        if (req.id) {
          await requisicaoEstoqueRepository.softDelete(req.id);
        }
      }
    });

    it("should not get requisicoes-estoque without authentication", async () => {
      const response = await request(app).get("/api/v1/requisicoes-estoque");
      expect(response.status).toBe(401);
    });

    it("should get list of requisicoes-estoque with pagination", async () => {
      const response = await request(app)
        .get("/api/v1/requisicoes-estoque")
        .set("Cookie", cookies)
        .query({ page: 0, size: 2 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.content)).toBe(true);
      expect(response.body.content.length).toBeLessThanOrEqual(2);
      expect(response.body).toHaveProperty("totalPages");
      expect(response.body).toHaveProperty("totalElements");
      expect(response.body).toHaveProperty("number");

      // Verificar estrutura do item retornado
      const firstItem = response.body.content[0];
      expect(firstItem).toHaveProperty("id");
      expect(firstItem).toHaveProperty("dataRequisicao");
      expect(firstItem).toHaveProperty("ordemProducao");
      expect(firstItem).toHaveProperty("valorTotal");
      expect(firstItem).toHaveProperty("obs");
      expect(firstItem).toHaveProperty("requisitante");
      expect(firstItem).toHaveProperty("equipamento");
      expect(firstItem).toHaveProperty("itens");
      expect(Array.isArray(firstItem.itens)).toBe(true);
    });

    it("should get second page of requisicoes-estoque", async () => {
      const response = await request(app)
        .get("/api/v1/requisicoes-estoque")
        .set("Cookie", cookies)
        .query({ page: 1, size: 2 });

      expect(response.status).toBe(200);
      expect(response.body.number).toBe(1);
      expect(Array.isArray(response.body.content)).toBe(true);
    });

    it("should handle sorting by ordemProducao", async () => {
      const response = await request(app)
        .get("/api/v1/requisicoes-estoque")
        .set("Cookie", cookies)
        .query({ sort: "ordemProducao,ASC" });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.content)).toBe(true);

      // Verificar se está ordenado
      const ordens = response.body.content.map((req: any) => req.ordemProducao);
      const ordensSorted = [...ordens].sort();
      expect(ordens).toEqual(ordensSorted);
    });

    it("should get all requisicoes-estoque without pagination", async () => {
      const response = await request(app)
        .get("/api/v1/requisicoes-estoque-all")
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      // Deve incluir a requisição inicial de teste e as 3 adicionais
      expect(response.body.length).toBeGreaterThanOrEqual(4);
    });

    it("should handle invalid page parameters", async () => {
      const response = await request(app)
        .get("/api/v1/requisicoes-estoque")
        .set("Cookie", cookies)
        .query({ page: -1, size: 0 });

      expect(response.status).toBe(400);
    });
  });
  describe("GET /api/v1/requisicoes-estoque/:id", () => {
    it("should not get requisicaoEstoque without authentication", async () => {
      const response = await request(app).get(
        `/api/v1/requisicoes-estoque/${testRequisicaoEstoque.id}`
      );
      expect(response.status).toBe(401);
    });

    it("should get requisicaoEstoque by id with valid authentication", async () => {
      const response = await request(app)
        .get(`/api/v1/requisicoes-estoque/${testRequisicaoEstoque.id}`)
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", testRequisicaoEstoque.id);
      expect(response.body).toHaveProperty("ordemProducao");
      expect(response.body).toHaveProperty("valorTotal");
      expect(response.body).toHaveProperty("obs");
      expect(response.body.requisitante).toHaveProperty(
        "id",
        testRequisitante.id
      );
      expect(response.body.equipamento).toHaveProperty(
        "id",
        testEquipamento.id
      );

      // Verificar estrutura dos itens
      expect(Array.isArray(response.body.itens)).toBe(true);
      const item = response.body.itens[0];
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("quantidade");
      expect(item).toHaveProperty("unidade");
      expect(item).toHaveProperty("valorUnitario");
      expect(item.insumo).toHaveProperty("id", testInsumo.id);
    });

    it("should return 404 for non-existent requisicaoEstoque", async () => {
      const response = await request(app)
        .get("/api/v1/requisicoes-estoque/9999999")
        .set("Cookie", cookies);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "message",
        "RequisicaoEstoque not found"
      );
    });

    it("should not return soft-deleted requisicaoEstoque", async () => {
      // Criar uma requisição para ser deletada
      const requisicao = await requisicaoEstoqueRepository.save(
        requisicaoEstoqueRepository.create({
          dataRequisicao: new Date(),
          ordemProducao: "OP_DELETE_TEST",
          valorTotal: 100.0,
          obs: "To be deleted",
          requisitante: testRequisitante,
          setor: testEquipamento,
          armazem: { id: testArmazem.id },
          itens: [
            {
              quantidade: 1,
              unidade: Unidade.KG,
              valorUnitario: 100.0,
              insumo: testInsumo,
            },
          ],
        })
      );

      // Soft delete
      await requisicaoEstoqueRepository.softDelete(requisicao.id);

      // Tentar buscar
      const response = await request(app)
        .get(`/api/v1/requisicoes-estoque/${requisicao.id}`)
        .set("Cookie", cookies);

      expect(response.status).toBe(404);
    });

    it("should validate id parameter format", async () => {
      const response = await request(app)
        .get("/api/v1/requisicoes-estoque/invalid-id")
        .set("Cookie", cookies);

      expect(response.status).toBe(400);
    });
  });
  describe("DELETE /api/v1/requisicoes-estoque/:id", () => {
    let requisicaoToDelete: RequisicaoEstoque;

    beforeEach(async () => {
      // Criar uma nova requisição antes de cada teste
      requisicaoToDelete = await requisicaoEstoqueRepository.save(
        requisicaoEstoqueRepository.create({
          dataRequisicao: new Date(),
          ordemProducao: "OP_TO_DELETE",
          valorTotal: 150.0,
          obs: "To be deleted",
          requisitante: testRequisitante,
          setor: testEquipamento,
          armazem: { id: testArmazem.id },
          itens: [
            {
              quantidade: 3,
              unidade: Unidade.KG,
              valorUnitario: 50.0,
              insumo: testInsumo,
            },
            {
              quantidade: 2,
              unidade: Unidade.KG,
              valorUnitario: 75.0,
              insumo: testInsumo,
            },
          ],
        })
      );

      expect(requisicaoToDelete.id).toBeDefined();
      expect(requisicaoToDelete.itens).toHaveLength(2);
      requisicaoToDelete.itens.forEach((item) => {
        expect(item.id).toBeDefined();
      });
    });

    afterEach(async () => {
      // Garantir limpeza após cada teste
      if (requisicaoToDelete?.id) {
        const req = await requisicaoEstoqueRepository.findOne({
          where: { id: requisicaoToDelete.id },
          withDeleted: true,
        });
        if (req && !req.deletedAt) {
          await requisicaoEstoqueRepository.softDelete(requisicaoToDelete.id);
        }
      }
    });

    it("should not delete requisicaoEstoque without authentication", async () => {
      const response = await request(app).delete(
        `/api/v1/requisicoes-estoque/${requisicaoToDelete.id}`
      );

      expect(response.status).toBe(401);

      // Verificar se a requisição ainda existe
      const reqExists = await requisicaoEstoqueRepository.findOne({
        where: { id: requisicaoToDelete.id },
      });
      expect(reqExists).toBeDefined();
    });

    it("should soft delete requisicaoEstoque and its items", async () => {
      const response = await request(app)
        .delete(`/api/v1/requisicoes-estoque/${requisicaoToDelete.id}`)
        .set("Cookie", cookies);

      expect(response.status).toBe(204);

      // Verificar soft delete da requisição
      const deletedReq = await requisicaoEstoqueRepository.findOne({
        where: { id: requisicaoToDelete.id },
        withDeleted: true,
        relations: {
          itens: true,
        },
      });

      expect(deletedReq).toBeDefined();
      expect(deletedReq?.deletedAt).toBeDefined();
      expect(deletedReq?.itens).toBeDefined();

      // Verificar se os itens foram soft deletados
      const itemIds = requisicaoToDelete.itens.map((item) => item.id);
      const deletedItems = await Promise.all(
        itemIds.map((id) =>
          requisicaoEstoqueRepository.manager.findOne(RequisicaoEstoqueItem, {
            where: { id },
            withDeleted: true,
          })
        )
      );

      deletedItems.forEach((item) => {
        expect(item?.deletedAt).toBeDefined();
      });

      // Verificar se não é possível acessar via GET
      const getResponse = await request(app)
        .get(`/api/v1/requisicoes-estoque/${requisicaoToDelete.id}`)
        .set("Cookie", cookies);

      expect(getResponse.status).toBe(404);
    });

    it("should return 404 when deleting non-existent requisicaoEstoque", async () => {
      const response = await request(app)
        .delete("/api/v1/requisicoes-estoque/9999999")
        .set("Cookie", cookies);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "message",
        "RequisicaoEstoque not found"
      );
    });

    it("should validate id parameter format", async () => {
      const response = await request(app)
        .delete("/api/v1/requisicoes-estoque/invalid-id")
        .set("Cookie", cookies);

      expect(response.status).toBe(400);
    });

    it("should not delete already deleted requisicaoEstoque", async () => {
      // Primeiro delete
      await request(app)
        .delete(`/api/v1/requisicoes-estoque/${requisicaoToDelete.id}`)
        .set("Cookie", cookies);

      // Tentativa de segundo delete
      const response = await request(app)
        .delete(`/api/v1/requisicoes-estoque/${requisicaoToDelete.id}`)
        .set("Cookie", cookies);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "message",
        "RequisicaoEstoque not found"
      );
    });

    it("should maintain referential integrity after delete", async () => {
      await request(app)
        .delete(`/api/v1/requisicoes-estoque/${requisicaoToDelete.id}`)
        .set("Cookie", cookies);

      // Verificar se o insumo ainda existe
      const insumo = await insumoRepository.findOne({
        where: { id: testInsumo.id },
      });
      expect(insumo).toBeDefined();

      // Verificar se o requisitante ainda existe
      const requisitante = await requisitanteRepository.findOne({
        where: { id: testRequisitante.id },
      });
      expect(requisitante).toBeDefined();

      // Verificar se o equipamento ainda existe
      const equipamento = await setorRepository.findOne({
        where: { id: testEquipamento.id },
      });
      expect(equipamento).toBeDefined();
    });

    it("should soft delete multiple requisicaoEstoque items correctly", async () => {
      // Verificar estado inicial dos itens
      const initialItems = await requisicaoEstoqueRepository.manager.find(
        RequisicaoEstoqueItem,
        {
          where: { requisicaoEstoque: { id: requisicaoToDelete.id } },
        }
      );
      expect(initialItems).toHaveLength(2);

      // Executar o delete
      await request(app)
        .delete(`/api/v1/requisicoes-estoque/${requisicaoToDelete.id}`)
        .set("Cookie", cookies);

      // Verificar se todos os itens foram soft deleted
      const deletedItems = await requisicaoEstoqueRepository.manager.find(
        RequisicaoEstoqueItem,
        {
          where: { requisicaoEstoque: { id: requisicaoToDelete.id } },
          withDeleted: true,
        }
      );

      expect(deletedItems).toHaveLength(2);
      deletedItems.forEach((item) => {
        expect(item.deletedAt).toBeDefined();
      });
    });
  });
});
