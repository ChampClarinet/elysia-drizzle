import {
  bigint,
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer("id").primaryKey(),
  password: varchar("password", { length: 128 }).notNull(),
  last_login: timestamp("last_login", { withTimezone: true }),
  is_superuser: boolean("is_superuser"),
  username: varchar("username", { length: 150 }).notNull(),
  first_name: varchar("first_name", { length: 150 }).notNull(),
  last_name: varchar("last_name", { length: 150 }).notNull(),
  email: varchar("email", { length: 150 }).notNull().default(""),
  is_staff: boolean("is_staff").notNull(),
  is_active: boolean("is_active").notNull(),
  date_joined: timestamp("date_joined", { withTimezone: true })
    .defaultNow()
    .notNull(),
  organization_id: bigint("organization_id", { mode: "number" }),
  role: varchar("role", { length: 2 }).notNull(),
  vendor_id: bigint("vendor_id", { mode: "number" }),
  created_at: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
