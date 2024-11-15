import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const regionEnum = pgEnum("region", [
  "BANGKOK AND VICINITY",
  "CENTRAL",
  "EAST",
  "NORTH EAST",
  "NORTH",
  "WEST",
  "SOUTH",
]);

export const provinceTable = pgTable("provinces", {
  id: integer("id").primaryKey(),
  name_th: varchar("name_th", { length: 255 }).notNull(),
  name_en: varchar("name_en", { length: 255 }).notNull(),
  region: regionEnum(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").$onUpdate(() => new Date()),
});
