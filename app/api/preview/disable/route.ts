import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

/** Quitte le mode brouillon (voir `app/api/preview/route.ts`). */

export async function GET(request: NextRequest) {
  const draft = await draftMode();
  draft.disable();

  const redirectTo = request.nextUrl.searchParams.get("redirect") || "/";
  redirect(redirectTo);
}
