// src/http/controllers/__tests__/AuthController.test.ts
import request from "supertest";
import app from "../../../app";
import { User } from "../../../domain/entities/User";
import { userRepository } from "../../../domain/repositories";

describe("AuthController", () => {
  let testUser: User;

  beforeAll(async () => {
    // Criar usuário de teste
    testUser = userRepository.create({
      name: "Test User",
      email: "test@example.com",
      password: "test123",
      role: "admin",
    });

    await testUser.hashPassword();

    await userRepository.save(testUser);
  });

  afterAll(async () => {
    // Limpar dados de teste
    await userRepository.delete(testUser.id);
  });

  describe("POST /api/v1/auth/signup", () => {
    it("should create new user", async () => {
      const response = await request(app).post("/api/v1/auth/signup").send({
        name: "New User",
        email: "newuser@example.com",
        password: "password123",
      });

      console.log(
        "should create new user and return tokens in cookies",
        response.body
      );
      expect(response.status).toBe(201);
      //expect(response.body).toHaveProperty("user");
      //expect(response.body.user).toHaveProperty("name", "New User");
      //expect(response.body.user).toHaveProperty("email", "newuser@example.com");
      //expect(response.body.user).not.toHaveProperty("password");
    });

    it("should return 400 when email already exists", async () => {
      const response = await request(app).post("/api/v1/auth/signup").send({
        name: "Test User",
        email: "test@example.com", // email já existente
        password: "password123",
        confirmPassword: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should authenticate user and return tokens in cookies", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "test@example.com",
        password: "test123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("user");
      expect(response.body.user).toHaveProperty("email", "test@example.com");
      expect(response.body).not.toHaveProperty("token"); // token deve estar apenas no cookie

      // Verifica cookies
      expect(response.headers["set-cookie"]).toBeDefined();
      expect(response.headers["set-cookie"]).toHaveLength(2);
      expect(response.headers["set-cookie"][0]).toMatch(/token=.*HttpOnly/);
      expect(response.headers["set-cookie"][1]).toMatch(
        /refreshToken=.*HttpOnly/
      );
    });

    it("should return 401 with invalid credentials", async () => {
      const response = await request(app).post("/api/v1/auth/login").send({
        email: "test@example.com",
        password: "wrong_password",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("POST /api/v1/auth/refresh", () => {
    it("should refresh tokens with valid refresh token cookie", async () => {
      const loginResponse = await request(app).post("/api/v1/auth/login").send({
        email: "test@example.com",
        password: "test123",
      });

      const cookies = loginResponse.headers["set-cookie"];
      const refreshResponse = await request(app)
        .post("/api/v1/auth/refresh")
        .set("Cookie", cookies);

      expect(refreshResponse.status).toBe(200);
      expect(refreshResponse.headers["set-cookie"]).toBeDefined();
      expect(refreshResponse.headers["set-cookie"]).toHaveLength(2);

      expect(refreshResponse.headers["set-cookie"][0]).toMatch(
        /token=.*HttpOnly/
      );
      expect(refreshResponse.headers["set-cookie"][1]).toMatch(
        /refreshToken=.*HttpOnly/
      );
    });

    it("should return 401 with invalid refresh token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/refresh")
        .set("Cookie", ["refreshToken=invalid_token"]);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("POST /api/v1/auth/logout", () => {
    it("should clear cookies and invalidate refresh token", async () => {
      // Primeiro fazer login
      const loginResponse = await request(app).post("/api/v1/auth/login").send({
        email: "test@example.com",
        password: "test123",
      });

      const cookies = loginResponse.headers["set-cookie"];

      const logoutResponse = await request(app)
        .post("/api/v1/auth/logout")
        .set("Cookie", cookies);

      expect(logoutResponse.status).toBe(200);
      //expect(logoutResponse.body).toHaveProperty("message");

      // Verifica se os cookies foram limpos
      expect(logoutResponse.headers["set-cookie"]).toBeDefined();
      expect(logoutResponse.headers["set-cookie"][0]).toMatch(
        /token=;.*Expires/
      );
      expect(logoutResponse.headers["set-cookie"][1]).toMatch(
        /refreshToken=;.*Expires/
      );

      // Verifica se o refresh token foi invalidado no banco
      const user = await userRepository.findOne({
        where: { email: "test@example.com" },
      });
      expect(user?.tokenVersion).toBeNull();
    });
  });

  describe("Protected Routes", () => {
    it("should access protected route with valid token cookie", async () => {
      // Primeiro fazer login para obter os cookies
      const loginResponse = await request(app).post("/api/v1/auth/login").send({
        email: "test@example.com",
        password: "test123",
      });

      const cookies = loginResponse.headers["set-cookie"];

      // Tentar acessar rota protegida
      const response = await request(app)
        .get("/api/v1/users")
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
    });

    it("should return 401 on protected route without token cookie", async () => {
      const response = await request(app).get("/api/v1/users");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message");
    });
  });
});
