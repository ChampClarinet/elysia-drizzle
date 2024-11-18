import Elysia, { t } from "elysia";
import { db } from "../database";
import { provinceTable } from "../database/schema/province";
import { districtTable } from "../database/schema/district";
import { subdistrictTable } from "../database/schema/subdistrict";

export const importModule = (app: Elysia<"/api/import">) =>
  app
    .get("/", () => "ok, import group works")
    .post(
      "/provinces",
      async ({ body, set }) => {
        const inserted = await db
          .insert(provinceTable)
          .values(
            body.map(
              ({ id, name_en, name_th, created_at, region, updated_at }) => ({
                id,
                name_en,
                name_th,
                region: region as any,
                created_at: created_at ? new Date() : new Date(),
                updated_at: updated_at ? new Date(updated_at) : new Date(),
              })
            )
          )
          .returning();
        set.status = 201;
        return {
          affected: inserted.length,
          data: inserted,
        };
      },
      {
        body: t.Array(
          t.Object({
            id: t.Numeric(),
            name_th: t.String(),
            name_en: t.String(),
            region: t.String(),
            created_at: t.Optional(t.String()),
            updated_at: t.Optional(t.String()),
          })
        ),
      }
    )
    .post(
      "/districts",
      async ({ body, set }) => {
        const inserted = await db
          .insert(districtTable)
          .values(
            body.map(
              ({
                id,
                name_en,
                name_th,
                created_at,
                province_id,
                updated_at,
              }) => ({
                id,
                name_en,
                name_th,
                province_id,
                created_at: created_at ? new Date() : new Date(),
                updated_at: updated_at ? new Date(updated_at) : new Date(),
              })
            )
          )
          .returning();
        set.status = 201;
        return {
          affected: inserted.length,
          data: inserted,
        };
      },
      {
        body: t.Array(
          t.Object({
            id: t.Numeric(),
            name_th: t.String(),
            name_en: t.String(),
            province_id: t.Numeric(),
            created_at: t.Optional(t.String()),
            updated_at: t.Optional(t.String()),
          })
        ),
      }
    )
    .post(
      "/subdistricts",
      async ({ body, set }) => {
        const inserted = await db
          .insert(subdistrictTable)
          .values(
            body.map(
              ({
                id,
                name_en,
                name_th,
                created_at,
                district_id,
                updated_at,
                zipcode,
              }) => ({
                id,
                name_en,
                name_th,
                district_id,
                zipcode,
                created_at: created_at ? new Date() : new Date(),
                updated_at: updated_at ? new Date(updated_at) : new Date(),
              })
            )
          )
          .returning();
        set.status = 201;
        return {
          affected: inserted.length,
          data: inserted,
        };
      },
      {
        body: t.Array(
          t.Object({
            id: t.Numeric(),
            name_th: t.String(),
            name_en: t.String(),
            zipcode: t.String(),
            district_id: t.Numeric(),
            created_at: t.Optional(t.String()),
            updated_at: t.Optional(t.String()),
          })
        ),
      }
    );
