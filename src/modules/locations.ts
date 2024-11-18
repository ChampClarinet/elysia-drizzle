import Elysia, { t } from "elysia";
import { eq } from "drizzle-orm";
import { db } from "../database";
import { provinceTable } from "../database/schema/province";
import { districtTable } from "../database/schema/district";
import { subdistrictTable } from "../database/schema/subdistrict";
import { listResponse } from "../utils";

export interface LocationResponse {
  name_th: string;
  id: number;
}

const locationsModule = (app: Elysia<"/api/locations">) =>
  app
    .get("/provinces", async () => {
      const provinces: LocationResponse[] = await db
        .select({
          id: provinceTable.id,
          name_th: provinceTable.name_th,
        })
        .from(provinceTable)
        .orderBy(provinceTable.id);

      return listResponse(provinces);
    })
    .get("/districts", async () => {
      const districts: LocationResponse[] = await db
        .select({
          id: districtTable.id,
          name_th: districtTable.name_th,
        })
        .from(districtTable)
        .orderBy(districtTable.id);

      return listResponse(districts);
    })
    .get("/subdistricts", async () => {
      const subdistricts: LocationResponse[] = await db
        .select({
          id: subdistrictTable.id,
          name_th: subdistrictTable.name_th,
        })
        .from(subdistrictTable)
        .orderBy(subdistrictTable.id);

      return listResponse(subdistricts);
    })
    .get(
      "/districts/:provinceId",
      async ({ params: { provinceId } }) => {
        const districts: LocationResponse[] = await db
          .select({
            id: districtTable.id,
            name_th: districtTable.name_th,
            zipcode: subdistrictTable.zipcode,
          })
          .from(districtTable)
          .where(eq(districtTable.province_id, provinceId))
          .orderBy(districtTable.id);

        return listResponse(districts);
      },
      {
        params: t.Object({
          provinceId: t.Numeric(),
        }),
      }
    )
    .get(
      "/subdistricts/:districtId",
      async ({ params: { districtId } }) => {
        const subdistricts: LocationResponse[] = await db
          .select({
            id: subdistrictTable.id,
            name_th: subdistrictTable.name_th,
            zipcode: subdistrictTable.zipcode,
          })
          .from(subdistrictTable)
          .where(eq(subdistrictTable.district_id, districtId))
          .orderBy(subdistrictTable.id);

        return listResponse(subdistricts);
      },
      {
        params: t.Object({
          districtId: t.Numeric(),
        }),
      }
    );

export default locationsModule;
