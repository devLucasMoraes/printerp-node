import request from "supertest";
import app from "../../../app";
import { userRepository } from "../../../domain/repositories";

describe("PUT /api/v1/users", () => {
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

  it("should update user profile successfully", async () => {
    const response = await request(app)
      .put(`/api/v1/users/${userId}`)
      .set("Cookie", cookies)
      .send({
        name: "Updated Name",
        email: "updated@example.com",
        password: "123456",
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Updated Name");
    expect(response.body.email).toBe("updated@example.com");
  });
});
