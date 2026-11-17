/**
 * This file defines the entire database schema (all tables).
 *
 * Relations between these tables are defined separately in `relations.ts`
 * using Drizzle's `defineRelations()` API.
 *
 * To configure the Supabase database using this schema as a guide, use the command:
 * ```
 * npx drizzle-kit push
 * ```
 *
 * @author Ajay Gandecha <agandecha@unc.edu>
 * @license MIT
 * @see https://comp426-25f.github.io/
 */

import { pgTable, text } from "drizzle-orm/pg-core";

/**
 * Defines the `profiles` database table with the following fields:
 * - `id` (text, primary key)
 * - `name` (text, required)
 * - `handle` (text, required)
 */
export const profilesTable = pgTable("profiles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  handle: text("handle").notNull(),
});
