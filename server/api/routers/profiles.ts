/**
 * tRPC procedures for reading and creating profiles.
 *
 * Use this file as the template for new routers:
 * - `publicProcedure` works without logging in.
 * - `protectedProcedure` requires a login and provides `ctx.subject.id`.
 * - `.input(...)` and `.output(...)` take Zod models from `server/models/`.
 */

import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "@/server/db/index";
import { profilesTable } from "@/server/db/schema";
import { NewUser } from "@/server/models/inputs";
import { Profile } from "@/server/models/responses";

/**
 * Loads the profile of the currently signed-in user.
 * Throws `NOT_FOUND` if the user has no profile row.
 */
const getAuthedUserProfile = protectedProcedure
  .output(Profile)
  .query(async ({ ctx }) => {
    const profile = await db.query.profilesTable.findFirst({
      where: { id: ctx.subject.id },
    });

    if (!profile) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No profile was found",
      });
    }

    return Profile.parse(profile);
  });

/**
 * Creates the profile row for a user who just signed up with Supabase Auth,
 * so that every auth user also has a row in our `profiles` table.
 */
const handleNewUser = protectedProcedure
  .input(NewUser)
  .mutation(async ({ ctx, input }) => {
    await db.insert(profilesTable).values({
      id: ctx.subject.id,
      name: input.name,
      handle: input.handle,
    });
  });

/** Router for all profile-related APIs. */
export const profilesApiRouter = createTRPCRouter({
  getAuthedUserProfile: getAuthedUserProfile,
  handleNewUser: handleNewUser,
});
