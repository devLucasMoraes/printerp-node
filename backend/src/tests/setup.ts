import retry from "async-retry";
import { config } from "../config/config";
import { appDataSource } from "../database";

beforeAll(async () => {
  try {
    if (config.getEnv() !== "test") {
      throw new Error("Tests must run in test environment");
    }

    await retry(
      async () => {
        if (!appDataSource.isInitialized) {
          console.log("Attempting to initialize test database...");
          await appDataSource.initialize();
        }

        await appDataSource.runMigrations();
        console.log("Test database initialized successfully");
      },
      {
        retries: 5,
        factor: 2,
        minTimeout: 1000,
        maxTimeout: 5000,
        onRetry: (error, attempt) => {
          console.log(
            `Attempt ${attempt}: Failed to connect to database:`,
            error
          );
        },
      }
    );
  } catch (error) {
    console.error("Error setting up test database:", error);
    throw error;
  }
});

afterAll(async () => {
  if (appDataSource.isInitialized) {
    await appDataSource.dropDatabase();
    await appDataSource.destroy();
    console.log("Test database destroyed");
  }
});
