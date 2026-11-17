/**
 * This file defines all of the relations between the tables in our database
 * schema using Drizzle's `defineRelations()` API (Relational Queries v2).
 *
 * Unlike the table definitions in `schema.ts`, relations do *not* change the
 * structure of the database. Instead, they tell Drizzle how tables connect so
 * that we can use the relational query API (`db.query.<table>.findMany(...)`)
 * to load nested data with `with: { ... }` and filter on related tables in
 * `where: { ... }`.
 *
 * All relations live in one place:
 * - `r.one.<table>({ from, to })` defines a relation to *one* row of another table.
 * - `r.many.<table>({ from, to })` defines a relation to *many* rows of another table.
 * - `.through(...)` defines a many-to-many relation that goes through a junction table.
 * - `alias` disambiguates multiple relations between the same pair of tables.
 *
 * @see https://orm.drizzle.team/docs/relations-v2
 *
 * @author Ajay Gandecha <agandecha@unc.edu>
 * @license MIT
 * @see https://comp426-25f.github.io/
 */

import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

// No relations yet: the only table is `profiles`. Add them here as tables are
// added to `schema.ts`. For example, if a `notes` table had an `authorId`:
//
//   profilesTable: {
//     notes: r.many.notesTable({
//       from: r.profilesTable.id,
//       to: r.notesTable.authorId,
//     }),
//   },
export const relations = defineRelations(schema, () => ({}));
