import { DataSource } from "typeorm";
import { config } from "../config/config";
import { getDatabaseConfig, NODE_ENV } from "../config/database";

const env = config.getEnv() as NODE_ENV;

const dbConfig = getDatabaseConfig(env);
// Log de debug (sem mostrar a senha)
console.log("Configuração do Banco:", {
  ...dbConfig,
  password: dbConfig.password ? "[PRESENTE]" : "[AUSENTE]",
  host: dbConfig.host || "[AUSENTE]",
  port: dbConfig.port || "[AUSENTE]",
  username: dbConfig.username || "[AUSENTE]",
  database: dbConfig.database || "[AUSENTE]",
});

export const appDataSource = new DataSource(getDatabaseConfig(env));
