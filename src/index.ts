import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";
import { importModule } from "./modules/import";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .use(swagger())
  .group("/import", importModule)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
