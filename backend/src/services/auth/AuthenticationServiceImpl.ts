import { JsonWebTokenError, sign, verify } from "jsonwebtoken";
import { authConfig } from "../../config/auth";
import { User } from "../../domain/entities/User";
import { userRepository } from "../../domain/repositories";
import {
  AuthenticationResult,
  AuthenticationService,
} from "../../domain/services/AuthenticationService";
import { UnauthorizedError } from "../../shared/errors";

export class AuthenticationServiceImpl implements AuthenticationService {
  async authenticate(
    email: string,
    password: string
  ): Promise<AuthenticationResult> {
    const user = await userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid credentials");
    }

    return this.generateTokens(user);
  }

  async refreshAuthentication(
    refreshToken: string
  ): Promise<AuthenticationResult> {
    try {
      const { id } = verify(refreshToken, authConfig.refreshTokenSecret) as {
        id: string;
      };

      const user = await userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new UnauthorizedError("User not found");
      }

      if (user.tokenVersion !== refreshToken) {
        throw new UnauthorizedError("Token has been revoked");
      }

      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedError("Invalid refresh token");
      }
      throw error;
    }
  }

  async revokeAuthentication(id: string): Promise<void> {
    const user = await userRepository.findOneBy({ id });
    if (user) {
      user.tokenVersion = null;
      await userRepository.save(user);
    }
  }

  private async generateTokens(user: User): Promise<AuthenticationResult> {
    const accessToken = sign({ id: user.id }, authConfig.accessTokenSecret, {
      expiresIn: authConfig.accessTokenExpiration,
    });

    const refreshToken = sign({ id: user.id }, authConfig.refreshTokenSecret, {
      expiresIn: authConfig.refreshTokenExpiration,
    });

    user.tokenVersion = refreshToken;
    await userRepository.save(user);

    return {
      user: this.mapUserToResponse(user),
      accessToken,
      refreshToken,
    };
  }

  private mapUserToResponse(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
