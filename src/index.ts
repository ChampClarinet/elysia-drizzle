import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";
import { importModule } from "./modules/import";
import locationsModule from "./modules/locations";
import authModule from "./modules/auth";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .group("/api", (app) =>
    app
      .use(swagger())
      .group("/import", importModule)
      .group("/locations", locationsModule)
      .group("/auth", authModule)
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
