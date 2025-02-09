import dotenv from "dotenv";
import path from "path";

const loadEnv = () => {
  const environment = process.env.NODE_ENV || "development";
  dotenv.config({ path: path.resolve(__dirname, `../../.env.${environment}`) });
  return environment;
};

// Carrega imediatamente
const environment = loadEnv();

export const config = {
  getPort(): number {
    return Number(process.env.PORT) || 3000;
  },

  getEnv(): string {
    return environment;
  },
};
