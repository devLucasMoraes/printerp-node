// src/socket/SocketService.ts
import { Server as HttpServer } from "http";
import { verify } from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { authConfig } from "../../config/auth";
import { userRepository } from "../../domain/repositories";
import { UnauthorizedError } from "../../shared/errors";

export class SocketService {
  private static instance: SocketService | null = null;
  private io: Server;
  private readonly connectedUsers: Set<string>;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
      },
    });

    this.connectedUsers = new Set();

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    this.io.use(async (socket, next) => {
      try {
        // Get the token from cookies instead of auth header
        const token = socket.handshake.headers.cookie
          ?.split(";")
          .find((c) =>
            c.trim().startsWith(`${authConfig.accessTokenCookieName}=`)
          )
          ?.split("=")[1];

        if (!token) {
          return next(new UnauthorizedError("Authentication error"));
        }

        const decoded = verify(token, authConfig.accessTokenSecret) as {
          id: string;
        };
        const user = await userRepository.findOne({
          where: { id: decoded.id },
        });

        if (!user) {
          return next(new UnauthorizedError("User not found"));
        }

        socket.data.user = user;
        next();
      } catch (error) {
        next(new UnauthorizedError("Authentication error"));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on("connection", (socket) => {
      const userId = socket.data.user.id;
      this.handleUserConnection(socket, userId);

      socket.on("disconnect", () => {
        this.handleUserDisconnection(userId);
      });
    });
  }

  private handleUserConnection(socket: Socket, userId: string) {
    socket.join(userId);
    this.connectedUsers.add(userId);
    console.log(`User connected: ${userId}`);
    console.log(`Total connected users: ${this.connectedUsers.size}`);
  }

  private handleUserDisconnection(userId: string) {
    this.connectedUsers.delete(userId);
    console.log(`User disconnected: ${userId}`);
    console.log(`Total connected users: ${this.connectedUsers.size}`);
  }

  public static initialize(server: HttpServer): SocketService {
    if (!this.instance) {
      this.instance = new SocketService(server);
    }
    return this.instance;
  }

  public static getInstance(): SocketService {
    if (!this.instance) {
      throw new Error(
        "SocketService not initialized. Call initialize() first."
      );
    }
    return this.instance;
  }

  public static shutdown(): void {
    if (this.instance?.io) {
      console.log("Shutting down SocketService...");
      this.instance.io.close();
      this.instance = null;
    }
  }

  public sendToUser(userId: string, event: string, data: any): boolean {
    try {
      this.io.to(userId).emit(event, data);
      return true;
    } catch (error) {
      console.error(`Error sending message to user ${userId}:`, error);
      return false;
    }
  }

  public broadcast(event: string, data: any): boolean {
    try {
      this.io.emit(event, data);
      return true;
    } catch (error) {
      console.error("Error broadcasting message:", error);
      return false;
    }
  }

  public getConnectedUsers(): string[] {
    return Array.from(this.connectedUsers);
  }

  public isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  public getIo() {
    if (!this.io) {
      throw new Error("Socket.IO not initialized.");
    }
    return this.io;
  }
}
