/**
 * Home page shown after logging in.
 *
 * This is a Client Component, so it can use React hooks and the tRPC hooks.
 * It is rendered by the Server Component in `page.tsx`, which checks that the
 * user is logged in and passes the user in as a prop.
 *
 * This page is a placeholder: it proves that auth, tRPC and the database all
 * work end to end. Replace its contents with the app's real home page.
 */

"use client";

import Loading from "@/components/loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Subject } from "@/server/models/auth";
import { api } from "@/utils/trpc/api";

type HomePageProps = { user: Subject };
export default function HomePage({ user }: HomePageProps) {
  // Fetch the signed-in user's profile through the tRPC API.
  const { data: profile, isLoading } =
    api.profiles.getAuthedUserProfile.useQuery();

  return (
    <div className="flex w-full flex-row justify-center px-3">
      <div className="mt-4 mb-12 w-full md:w-[600px]">
        {isLoading ? (
          <Loading />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {profile?.name ?? "there"}!</CardTitle>
              <CardDescription>
                {profile ? `@${profile.handle}` : "No profile found."}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-1 text-sm">
              <p>You are signed in. Your user ID is {user.id}.</p>
              <p>This page is a placeholder. Build the app from here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
