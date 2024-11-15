import { db } from "./src/database";
import { provinceTable } from "./src/database/schema/province";
import { districtTable } from "./src/database/schema/district";
import { subdistrictTable } from "./src/database/schema/subdistrict";

const seed = async () => {
  await db.transaction(async (tx) => {
    const provincesData = (await import("./rawdata/public.province.json")).default;
    await tx.insert(provinceTable).values(
      provincesData.map(
        ({ id, name_en, name_th, created_at, region, updated_at }) => ({
          id,
          name_en,
          name_th,
          region: region as any,
          created_at: created_at ? new Date() : new Date(),
          updated_at: updated_at ? new Date(updated_at) : new Date(),
        })
      )
    );

    const districtsData = (await import("./rawdata/public.district.json")).default;
    await tx.insert(districtTable).values(
      districtsData.map(
        ({ id, name_en, name_th, created_at, province_id, updated_at }) => ({
          id,
          name_en,
          name_th,
          province_id,
          created_at: created_at ? new Date() : new Date(),
          updated_at: updated_at ? new Date(updated_at) : new Date(),
        })
      )
    );
    const subdistrictsData = (await import("./rawdata/public.subdistrict.json")).default;
    await tx.insert(subdistrictTable).values(
      subdistrictsData.map(
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
    );
  });
};

seed();
