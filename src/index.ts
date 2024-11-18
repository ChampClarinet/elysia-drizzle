import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";
import { importModule } from "./modules/import";
import locationsModule from "./modules/locations";

const app = new Elysia({ prefix: "/api" })
  .get("/", () => "Hello Elysia")
  .use(swagger())
  .group("/import", importModule)
  .group("/locations", locationsModule)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
