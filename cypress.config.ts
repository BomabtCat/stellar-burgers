import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4000",
    viewportWidth: 1280,
    viewportHeight: 720,
    env: {
      API_URL: "https://norma.nomoreparties.space/api",
      TEST_USER_EMAIL: "artem5556@mail.com",
      TEST_USER_PASSWORD: "2345jhhvgvgfc"
    },
  },
});
