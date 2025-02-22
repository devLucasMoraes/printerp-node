import { Server } from "http";
import gracefulShutdown from "http-graceful-shutdown";
import "reflect-metadata";
import app from "./app";
import { config } from "./config/config";
import { appDataSource } from "./database";
import { SocketService } from "./services/socket/SocketService";

async function startDatabase(): Promise<void> {
  try {
    await appDataSource.initialize();
    console.log("Database connected");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    throw error;
  }
}

function createServer(): Server {
  return app.listen(config.getPort(), () => {
    console.info(`Server started on port: ${config.getPort()}`);
  });
}

function setupSocket(server: Server): void {
  SocketService.initialize(server);
  console.log("Socket.IO initialized");
}

function setupGracefulShutdown(server: Server): void {
  gracefulShutdown(server);
}

const startServer = async () => {
  try {
    await startDatabase();

    const server = createServer();
    setupSocket(server);
    setupGracefulShutdown(server);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Inicia o servidor apenas se este arquivo for executado diretamente
if (require.main === module) {
  startServer();
}
