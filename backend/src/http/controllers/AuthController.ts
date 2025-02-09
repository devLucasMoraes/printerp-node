import { RequestHandler, Response } from "express";
import { authConfig } from "../../config/auth";
import { AuthenticationServiceImpl } from "../../services/auth/AuthenticationServiceImpl";
import { UnauthorizedError } from "../../shared/errors";
import { loginSchema } from "../validators/auth.schema";

export class AuthController {
  constructor(private authenticationService: AuthenticationServiceImpl) {}

  login: RequestHandler = async (req, res) => {
    const { email, password }: loginSchema = req.body;

    const result = await this.authenticationService.authenticate(
      email,
      password
    );

    this.setAccessTokenCookie(res, result.accessToken);
    this.setRefreshTokenCookie(res, result.refreshToken);

    res.json({
      user: result.user,
    });
  };

  refresh: RequestHandler = async (req, res) => {
    const refreshToken = req.cookies[authConfig.refreshTokenCookieName];

    if (!refreshToken) {
      throw new UnauthorizedError("No refresh token provided");
    }

    const result = await this.authenticationService.refreshAuthentication(
      refreshToken
    );

    this.setAccessTokenCookie(res, result.accessToken);
    this.setRefreshTokenCookie(res, result.refreshToken);

    res.json(result.user);
  };

  logout: RequestHandler = async (req, res) => {
    const userId = req.user.id;

    if (!userId) {
      throw new UnauthorizedError("No user ID provided in request");
    }

    await this.authenticationService.revokeAuthentication(userId);
    this.clearAccessTokenCookie(res);
    this.clearRefreshTokenCookie(res);

    res.sendStatus(200);
  };

  private setRefreshTokenCookie(res: Response, token: string): void {
    res.cookie(authConfig.refreshTokenCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: authConfig.refreshTokenCookieMaxAge,
      path: "/",
    });
  }

  private setAccessTokenCookie(res: Response, token: string): void {
    res.cookie(authConfig.accessTokenCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: authConfig.refreshTokenCookieMaxAge,
      path: "/",
    });
  }

  private clearAccessTokenCookie(res: Response): void {
    res.cookie(authConfig.accessTokenCookieName, "", {
      expires: new Date(0),
      path: "/",
    });
  }

  private clearRefreshTokenCookie(res: Response): void {
    res.cookie(authConfig.refreshTokenCookieName, "", {
      expires: new Date(0),
      path: "/",
    });
  }
}
