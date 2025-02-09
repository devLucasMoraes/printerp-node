import request from "supertest";
import app from "../../../app";
import { userRepository } from "../../../domain/repositories";

describe("DELETE /users", () => {
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

  it("should not delete user without authentication", async () => {
    const response = await request(app).delete(`/api/v1/users/${userId}`);
    expect(response.status).toBe(401);
  });

  it("should not delete user that doesn't exist", async () => {
    const response = await request(app)
      .delete("/api/v1/users/9398095a-10aa-4566-92a1-b2f0f7f817af")
      .set("Cookie", cookies);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  it("should delete user successfully", async () => {
    const response = await request(app)
      .delete(`/api/v1/users/${userId}`)
      .set("Cookie", cookies);

    expect(response.status).toBe(204);

    const verifyResponse = await request(app)
      .get(`/api/v1/users/${userId}`)
      .set("Cookie", cookies);

    expect(verifyResponse.status).toBe(401);
  });
});
