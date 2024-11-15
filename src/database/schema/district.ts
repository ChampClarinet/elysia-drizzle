import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const districtTable = pgTable("districts", {
  id: integer("id").primaryKey(),
  name_th: varchar("name_th", { length: 255 }).notNull(),
  name_en: varchar("name_en", { length: 255 }).notNull(),
  province_id: integer("province_id").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").$onUpdate(() => new Date()),
  province_code: varchar("province_code", { length: 2 }),
  district_code: varchar("district_code", { length: 4 }),
});
