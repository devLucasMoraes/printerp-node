import request from "supertest";
import app from "../../../app";
import { userRepository } from "../../../domain/repositories";

describe("GET /api/v1/users", () => {
  let cookies: string[] = [];
  let userId: string;

  beforeAll(async () => {
    // Criar usuário
    const user = userRepository.create({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });
    await user.hashPassword();
    await userRepository.save(user);
    userId = user.id;

    // Fazer login para obter cookies
    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "test@example.com", password: "123456" });

    const setCookies = loginResponse.headers["set-cookie"];
    cookies = Array.isArray(setCookies) ? setCookies : [setCookies as string];
  });

  it("should not get user profile without authentication", async () => {
    const response = await request(app).get(`/api/v1/users/${userId}`);
    expect(response.status).toBe(401);
  });

  it("should get user profile with valid authentication", async () => {
    const response = await request(app)
      .get(`/api/v1/users/${userId}`)
      .set("Cookie", cookies);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.email).toBe("test@example.com");
  });

  it("should get list of users with pagination", async () => {
    const response = await request(app)
      .get("/api/v1/users")
      .set("Cookie", cookies)
      .query({ page: 1, size: 10 });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.content)).toBe(true);
    expect(response.body).toHaveProperty("totalPages");
    expect(response.body).toHaveProperty("totalElements");
    expect(response.body).toHaveProperty("number");
  });
});
